/*
  Warnings:

  - You are about to drop the column `Token` on the `tokenDB` table. All the data in the column will be lost.
  - You are about to drop the column `UUID` on the `tokenDB` table. All the data in the column will be lost.
  - Added the required column `Token_string` to the `tokenDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UUID_string` to the `tokenDB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tokenDB` DROP COLUMN `Token`,
    DROP COLUMN `UUID`,
    ADD COLUMN `Token_string` VARCHAR(191) NOT NULL,
    ADD COLUMN `UUID_string` VARCHAR(191) NOT NULL;
