import { Request, Response } from "express";

export const healthcheck = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: "Pong! Sunucu çalışıyor. 🏓",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
