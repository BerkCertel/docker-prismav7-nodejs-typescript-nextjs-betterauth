import express from "express";

import { prisma } from "../prisma";
import { getUserLocations } from "../middlewares/LocationMiddlewares";
import { isAdmin, isSuperAdmin, protect } from "../middlewares/authMiddlwares";

const locationRouter = express.Router();

// ✅ Kullanıcının erişebildiği lokasyonları listele
locationRouter.get(
  "/my-locations",
  protect,
  getUserLocations,
  async (req, res) => {
    res.json({
      success: true,
      data: req.userLocations,
    });
  }
);

// ✅ Tüm lokasyonları listele (Admin/SuperAdmin)
locationRouter.get("/", protect, isAdmin, async (req, res) => {
  const locations = await prisma.location.findMany({
    include: {
      _count: {
        select: {
          userLocations: true,
          qrCodes: true,
          products: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: locations,
  });
});

// ✅ Lokasyon oluştur (SuperAdmin)
locationRouter.post("/", protect, isSuperAdmin, async (req, res) => {
  const { location } = req.body;

  const newLocation = await prisma.location.create({
    data: { location },
  });

  res.json({
    success: true,
    data: newLocation,
  });
});

// ✅ Kullanıcıya lokasyon ata (SuperAdmin)
locationRouter.post("/assign", protect, isSuperAdmin, async (req, res) => {
  const { userId, locationId } = req.body;

  // Lokasyon zaten atanmış mı kontrol et
  const existing = await prisma.userLocation.findUnique({
    where: {
      userId_locationId: {
        userId,
        locationId: parseInt(locationId),
      },
    },
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Bu kullanıcıya bu lokasyon zaten atanmış.",
    });
  }

  const assignment = await prisma.userLocation.create({
    data: {
      userId,
      locationId: parseInt(locationId),
      assignedBy: req.user.id,
    },
    include: {
      user: { select: { email: true, name: true } },
      location: { select: { location: true } },
    },
  });

  res.json({
    success: true,
    message: "Lokasyon kullanıcıya atandı",
    data: assignment,
  });
});

// ✅ Kullanıcıdan lokasyon kaldır (SuperAdmin)
locationRouter.delete(
  "/assign/:userId/:locationId",
  protect,
  isSuperAdmin,
  async (req, res) => {
    const { userId, locationId } = req.params;

    await prisma.userLocation.delete({
      where: {
        userId_locationId: {
          userId,
          locationId: parseInt(locationId),
        },
      },
    });

    res.json({
      success: true,
      message: "Lokasyon erişimi kaldırıldı",
    });
  }
);

export default locationRouter;
