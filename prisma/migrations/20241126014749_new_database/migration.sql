/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `point` DROP FOREIGN KEY `point_ibfk_1`;

-- DropForeignKey
ALTER TABLE `reminder` DROP FOREIGN KEY `reminder_ibfk_1`;

-- DropForeignKey
ALTER TABLE `result` DROP FOREIGN KEY `result_ibfk_1`;

-- AlterTable
ALTER TABLE `point` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `reminder` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `result` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `user_id` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- AddForeignKey
ALTER TABLE `point` ADD CONSTRAINT `point_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reminder` ADD CONSTRAINT `reminder_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `result` ADD CONSTRAINT `result_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
