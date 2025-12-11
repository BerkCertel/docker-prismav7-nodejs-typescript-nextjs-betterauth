// src/middlewares/protect.ts
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/auth";
import { prisma } from "../prisma";
import { UserRole } from "../generated/prisma/client";

// ✅ Temel authentication kontrolü
export async function protect(req: any, res: any, next: any) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: "Yetkisiz erişim. Lütfen giriş yapın.",
      });
    }

    // ✅ KRITIK: Veritabanından kullanıcıyı kontrol et
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
      },
    });

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    // ✅ Ban kontrolü
    if (dbUser.banned) {
      const isBanExpired =
        dbUser.banExpires && new Date(dbUser.banExpires) < new Date();

      if (!isBanExpired) {
        return res.status(403).json({
          success: false,
          message: `Hesabınız engellenmiştir. Sebep: ${
            dbUser.banReason || "Belirtilmemiş"
          }`,
          banExpires: dbUser.banExpires,
        });
      }
    }

    // ✅ Kullanıcıyı req'e ekle (VERİTABANINDAN gelen bilgi)
    req.user = dbUser;
    req.session = session;

    // console.log(dbUser);
    // console.log(session);

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(401).json({
      success: false,
      message: "Kimlik doğrulama hatası.",
    });
  }
}

// ✅ Admin veya SuperAdmin kontrolü (veritabanından)
export async function isAdmin(req: any, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Kullanıcı bilgisi bulunamadı.",
    });
  }

  if (
    req.user.role !== UserRole.admin &&
    req.user.role !== UserRole.superadmin
  ) {
    return res.status(401).json({
      success: false,
      message: "Kullanıcı admin değil.",
    });
  }

  // ✅ KRITIK: Veritabanından tekrar kontrol et
  const dbUser = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { role: true, banned: true },
  });

  if (!dbUser) {
    return res.status(401).json({
      success: false,
      message: "Kullanıcı bulunamadı.",
    });
  }

  if (dbUser.banned) {
    return res.status(403).json({
      success: false,
      message: "Hesabınız engellenmiştir.",
    });
  }

  // ✅ Enum kontrolü
  if (dbUser.role !== UserRole.admin && dbUser.role !== UserRole.superadmin) {
    return res.status(403).json({
      success: false,
      message: "Bu işlem için admin yetkisi gereklidir.",
      requiredRole: "admin veya superadmin",
      currentRole: dbUser.role,
    });
  }

  next();
}

// ✅ Sadece SuperAdmin kontrolü (veritabanından)
export async function isSuperAdmin(req: any, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Kullanıcı bilgisi bulunamadı.",
    });
  }

  // ✅ KRITIK: Veritabanından tekrar kontrol et
  const dbUser = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { role: true, banned: true },
  });

  if (!dbUser) {
    return res.status(401).json({
      success: false,
      message: "Kullanıcı bulunamadı.",
    });
  }

  if (dbUser.banned) {
    return res.status(403).json({
      success: false,
      message: "Hesabınız engellenmiştir.",
    });
  }

  // ✅ Enum kontrolü
  if (dbUser.role !== UserRole.superadmin) {
    return res.status(403).json({
      success: false,
      message: "Bu işlem için süper admin yetkisi gereklidir.",
      requiredRole: "superadmin",
      currentRole: dbUser.role,
    });
  }

  if (dbUser.role == UserRole.superadmin) {
    console.log("Kullanıcı rolu işlemi yapmya uygun.");
  }

  next();
}

// ✅ Belirli bir yetki kontrolü
export function hasPermission(permission: {
  resource: string;
  action: string;
}) {
  return async (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı bilgisi bulunamadı.",
      });
    }

    try {
      const resource = permission.resource.toLowerCase();
      const action = permission.action.toLowerCase();

      const result = await auth.api.userHasPermission({
        body: {
          userId: req.user.id,
          permissions: {
            [resource]: [action],
          },
        },
      });

      // ❗ BetterAuth admin plugin success = true döner
      if (!result || result.success !== true) {
        return res.status(403).json({
          success: false,
          message: "Bu işlem için yetkiniz bulunmamaktadır.",
          required: { resource, action },
          currentRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(403).json({
        success: false,
        message: "Yetki kontrolü sırasında hata oluştu.",
      });
    }
  };
}
