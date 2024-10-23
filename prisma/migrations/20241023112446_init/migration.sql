/*
  Warnings:

  - You are about to drop the `TokenDB` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `TokenDB`;

-- CreateTable
CREATE TABLE `tokenDB` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `UUID` VARCHAR(191) NOT NULL,
    `Token` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
