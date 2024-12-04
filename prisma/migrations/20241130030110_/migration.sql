/*
  Warnings:

  - You are about to drop the column `created_at` on the `predict` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `predict` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history` ADD COLUMN `user_id` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `predict` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`;

-- CreateIndex
CREATE INDEX `user_idfk` ON `history`(`user_id`);

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `user_idfk` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
