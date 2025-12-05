// src/middlewares/protect.ts
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/auth";

export async function protect(req: any, res: any, next: any) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: "Session not found." });
    }

    // kullanıcı bilgisini req içine koy
    req.user = session.user;
    req.session = session;

    next();
  } catch (err) {
    return res.status(401).json({ message: "User not authenticated." });
  }
}

export async function isAdmin(req: any, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden: Not Admin" });
  }

  next();
}

export async function isSuperAdmin(req: any, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden: Not SuperAdmin" });
  }

  next();
}
