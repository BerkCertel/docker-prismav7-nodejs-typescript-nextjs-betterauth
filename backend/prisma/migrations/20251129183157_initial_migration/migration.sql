/*
  Warnings:

  - You are about to drop the column `image_url` on the `categories` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
