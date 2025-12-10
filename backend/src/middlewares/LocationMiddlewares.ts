// import { prisma } from "../prisma";
// import { UserRole } from "../generated/prisma/enums";

// // ✅ Kullanıcının belirli bir lokasyona erişimi var mı?
// export async function requireLocationAccess(req: any, res: any, next: any) {
//   if (!req.user) {
//     return res.status(401).json({
//       success: false,
//       message: "Giriş gerekli",
//     });
//   }

//   // locationId parametreden, query'den veya body'den alınabilir
//   const locationId =
//     req.params.locationId || req.query.locationId || req.body.locationId;

//   if (!locationId) {
//     return res.status(400).json({
//       success: false,
//       message: "Location ID gerekli",
//     });
//   }

//   // ✅ SuperAdmin her lokasyona erişebilir
//   if (req.user.role === UserRole.superadmin) {
//     req.locationId = parseInt(locationId);
//     return next();
//   }

//   // ✅ Kullanıcının bu lokasyona erişimi var mı kontrol et
//   const hasAccess = await prisma.userLocation.findUnique({
//     where: {
//       userId_locationId: {
//         userId: req.user.id,
//         locationId: parseInt(locationId),
//       },
//     },
//     include: {
//       location: {
//         select: {
//           id: true,
//           location: true,
//           active: true,
//         },
//       },
//     },
//   });

//   if (!hasAccess) {
//     return res.status(403).json({
//       success: false,
//       message: "Bu lokasyona erişim yetkiniz bulunmamaktadır.",
//       requestedLocation: locationId,
//     });
//   }

//   // Lokasyon aktif mi kontrol et
//   if (!hasAccess.location.active) {
//     return res.status(403).json({
//       success: false,
//       message: "Bu lokasyon aktif değil.",
//     });
//   }

//   // ✅ Erişim var, req'e locationId ekle
//   req.locationId = hasAccess.location.id;
//   req.locationName = hasAccess.location.location;

//   next();
// }

// // ✅ Kullanıcının erişebildiği tüm lokasyonları getir
// export async function getUserLocations(req: any, res: any, next: any) {
//   if (!req.user) {
//     return res.status(401).json({
//       success: false,
//       message: "Giriş gerekli",
//     });
//   }

//   // SuperAdmin tüm lokasyonları görebilir
//   if (req.user.role === UserRole.superadmin) {
//     const allLocations = await prisma.location.findMany({
//       where: { active: true },
//       select: {
//         id: true,
//         location: true,
//         active: true,
//       },
//     });

//     req.userLocations = allLocations;
//     return next();
//   }

//   // Normal kullanıcı sadece atanan lokasyonları görebilir
//   const userLocations = await prisma.userLocation.findMany({
//     where: { userId: req.user.id },
//     include: {
//       location: {
//         select: {
//           id: true,
//           location: true,
//           active: true,
//         },
//       },
//     },
//   });

//   req.userLocations = userLocations
//     .map((ul) => ul.location)
//     .filter((loc) => loc.active);

//   next();
// }
