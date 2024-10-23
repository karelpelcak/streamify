/*
  Warnings:

  - You are about to drop the column `Token_string` on the `tokenDB` table. All the data in the column will be lost.
  - You are about to drop the column `UUID_string` on the `tokenDB` table. All the data in the column will be lost.
  - Added the required column `token_string` to the `tokenDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uUID_string` to the `tokenDB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tokenDB` DROP COLUMN `Token_string`,
    DROP COLUMN `UUID_string`,
    ADD COLUMN `token_string` VARCHAR(191) NOT NULL,
    ADD COLUMN `uUID_string` VARCHAR(191) NOT NULL;
