/*
  Warnings:

  - You are about to alter the column `imageUrl` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `imageUrl` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "imageUrl" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "imageUrl" VARCHAR(255) NOT NULL;
