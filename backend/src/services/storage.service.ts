import {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client, BUCKETS } from "../config/minio.config";
import { UploadResult, DeleteResult } from "../types";

// ========== UUID GENERATOR (uuid paketi yerine) ==========
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class StorageService {
  /**
   * Dosya yükleme
   */
  static async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    bucket: keyof typeof BUCKETS,
    mimetype: string = "image/jpeg"
  ): Promise<UploadResult> {
    try {
      // Benzersiz dosya adı oluştur
      const fileExtension = originalName.split(".").pop();
      const fileName = `${generateUUID()}.${fileExtension}`;
      const bucketName = BUCKETS[bucket];

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
      });

      await s3Client.send(command);

      const url = `${process.env.MINIO_ENDPOINT}/${bucketName}/${fileName}`;

      return {
        url,
        fileName,
        bucket: bucketName,
        size: fileBuffer.length,
      };
    } catch (error) {
      console.error("MinIO upload error:", error);
      throw new Error("Dosya yüklenirken hata oluştu");
    }
  }

  /**
   * Dosya silme
   */
  static async deleteFile(
    fileName: string,
    bucket: keyof typeof BUCKETS
  ): Promise<DeleteResult> {
    try {
      const bucketName = BUCKETS[bucket];

      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      await s3Client.send(command);

      return {
        success: true,
        fileName,
      };
    } catch (error) {
      console.error("MinIO delete error:", error);
      throw new Error("Dosya silinirken hata oluştu");
    }
  }

  /**
   * Dosya var mı kontrolü
   */
  static async fileExists(
    fileName: string,
    bucket: keyof typeof BUCKETS
  ): Promise<boolean> {
    try {
      const bucketName = BUCKETS[bucket];

      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      await s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * URL'den dosya adını çıkar
   */
  static extractFileNameFromUrl(url: string): string | null {
    try {
      const urlParts = url.split("/");
      return urlParts[urlParts.length - 1];
    } catch {
      return null;
    }
  }

  /**
   * Eski dosyayı sil, yeni dosya yükle (güncelleme için)
   */
  static async replaceFile(
    oldUrl: string | null,
    newFileBuffer: Buffer,
    originalName: string,
    bucket: keyof typeof BUCKETS,
    mimetype: string = "image/jpeg"
  ): Promise<UploadResult> {
    // Önce yeni dosyayı yükle
    const uploadResult = await this.uploadFile(
      newFileBuffer,
      originalName,
      bucket,
      mimetype
    );

    // Eski dosya varsa sil
    if (oldUrl) {
      const oldFileName = this.extractFileNameFromUrl(oldUrl);
      if (oldFileName) {
        try {
          await this.deleteFile(oldFileName, bucket);
        } catch (error) {
          console.warn("Eski dosya silinemedi:", error);
        }
      }
    }

    return uploadResult;
  }
}
