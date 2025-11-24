// Gerekli kütüphaneleri içeri aktarıyoruz
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"; // Frontend ile backend arasındaki iletişimi sağlamak için
import { Pool } from "pg"; // PostgreSQL'e bağlanmak için
import { PrismaClient } from "./generated/prisma/client";
import categoryRouter from "./routes/categoryRoute";
import healthcheckRouter from "./routes/healthcheckRoute";
import { PrismaPg } from "@prisma/adapter-pg";

// .env dosyasındaki değişkenleri projemize yüklüyoruz
dotenv.config();

// Ortam değişkenlerini alıyoruz
const PORT = process.env.PORT;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;
const POSTGRES_HOST = process.env.POSTGRES_HOST; // docker-compose.yml'deki servis adı

// Değişkenlerin var olup olmadığını kontrol ediyoruz. Bu, hataları en başta yakalamamızı sağlar.
if (!POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_DB || !POSTGRES_HOST) {
  throw new Error("Veritabanı için gerekli ortam değişkenlerinden biri eksik!");
}
// Yeni bir Express uygulaması oluşturuyoruz
const app: Express = express();

// Gelen isteklerin JSON formatında olmasını sağlıyoruz
app.use(express.json());
// CORS'u etkinleştiriyoruz. Bu sayede frontend (localhost:3000) backend'e (localhost:5000) istek atabilir.
app.use(cors());

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

app.use("/api/category", categoryRouter);
app.use("/api/healthcheck", healthcheckRouter);

// 1. Basit bir sağlık kontrolü rotası
// Bu, sunucunun ayakta olup olmadığını kontrol etmek için kullanılır.
app.get("/api/ping", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Pong! Sunucu çalışıyor. 🏓",
  });
});

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
