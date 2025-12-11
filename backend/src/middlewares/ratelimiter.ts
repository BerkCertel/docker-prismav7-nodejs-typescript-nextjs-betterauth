// src/middlewares/rateLimiter.ts

import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// ✅ API genel limiter (auth hariç diğer route'lar için)
export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 dakika
  max: 1000,
  handler: (req, res) => {
    const now = Date.now();
    const retryAfter = req.rateLimit?.resetTime
      ? Math.ceil((req.rateLimit.resetTime.getTime() - now) / 1000) // ✅ . getTime() eklendi
      : 10 * 60;

    res.set("Retry-After", retryAfter.toString()); // ✅ .toString() eklendi
    res.status(429).json({
      success: false,
      message: "Çok fazla istek yaptınız. Lütfen daha sonra tekrar deneyin.",
      retryAfter,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  // skip fonksiyonu ile bazı route'ları hariç tutabilirsiniz
  skip: (req) => req.path.startsWith("/api/healthcheck"),
});

// ✅ Slowdown (trafik artınca cevapları yavaşlat)
export const apiSlowdown = slowDown({
  windowMs: 60 * 1000, // 1 dakika
  delayAfter: 50, // 50 istekten sonra yavaşlat
  delayMs: (hits) => hits * 100, // Her istek için 100ms ekle
});
