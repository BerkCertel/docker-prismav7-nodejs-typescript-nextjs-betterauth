import express, { Express } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";
import categoryRouter from "./routes/categoryRoute";
import productRouter from "./routes/productRoute";
import healthcheckRouter from "./routes/healthcheckRoute";

// .env dosyasındaki değişkenleri projemize yüklüyoruz
dotenv.config();

// Ortam değişkenlerini alıyoruz
const PORT = process.env.PORT;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;
const POSTGRES_HOST = process.env.POSTGRES_HOST;

// Değişkenlerin var olup olmadığını kontrol ediyoruz. Bu, hataları en başta yakalamamızı sağlar.
if (!POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_DB || !POSTGRES_HOST) {
  throw new Error("Veritabanı için gerekli ortam değişkenlerinden biri eksik!");
}
// Yeni bir Express uygulaması oluşturuyoruz
const app: Express = express();

//! Proxy arkasında çalışıyorsak gerçek IP adresini alabilmek için
app.set("trust proxy", 1);

//! 2. Cloudflare Kullanırsan
// Cloudflare her zaman proxy olarak çalışır:
// typescriptapp.set("trust proxy", true); // Birden fazla proxy olabilir

// Gelen isteklerin JSON formatında olmasını sağlıyoruz
app.use(express.json());
// URL encoded verileri de kabul ediyoruz
app.use(express.urlencoded({ extended: true }));
// CORS'u etkinleştiriyoruz. Bu sayede frontend (localhost:3000) backend'e (localhost:5000) istek atabilir.
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// app.use(cors());

// PostgreSQL veritabanı için bağlantı havuzu (pool) oluşturuyoruz.
// Pool, tek tek bağlantı açıp kapatmak yerine birden çok bağlantıyı yönetir, bu daha verimlidir.
const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: 5432, // PostgreSQL'in varsayılan portu
});

// Prisma 7 için adapter kullanarak PrismaClient oluşturuyoruz
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Global error handler (EN SONA EKLE, app.listen'dan ÖNCE)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error:", err);

    // Multer dosya boyutu hatası
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: `Dosya boyutu çok büyük. Maksimum: ${
          process.env.MAX_FILE_SIZE
            ? Number(process.env.MAX_FILE_SIZE) / 1024 / 1024
            : 5
        }MB`,
      });
    }

    // Multer dosya tipi hatası
    if (err.message && err.message.includes("Geçersiz dosya tipi")) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }

    // Genel hata
    res.status(500).json({
      success: false,
      error: err.message || "Sunucu hatası",
    });
  }
);

app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/healthcheck", healthcheckRouter);

// Sunucuyu dinlemeye" başlıyoruz
app.listen(PORT, () => {
  console.log(
    `🚀 Sunucu http://localhost:${PORT} adresinde çalışmaya başladı.`
  );

  // Başlangıçta veritabanı bağlantısını kontrol edelim
  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("🔴 PostgreSQL bağlantı hatası:", err.message);
    } else {
      console.log("✅ PostgreSQL bağlantısı başarılı!");
    }
  });
});

async function start() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma veritabanına başarıyla bağlandı!");
  } catch (error) {
    console.error("🔴 Prisma veritabanına bağlanamadı:", error);
    process.exit(1);
  }
}

start();
