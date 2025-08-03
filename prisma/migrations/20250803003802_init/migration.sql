-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'SUPERADMIN') NOT NULL DEFAULT 'USER',
    `verifyToken` VARCHAR(191) NULL,
    `resetToken` VARCHAR(191) NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `tokenCreatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resetTokenCreatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `birthdate` DATETIME(3) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_verifyToken_key`(`verifyToken`),
    UNIQUE INDEX `users_resetToken_key`(`resetToken`),
    INDEX `idx_tokenCreatedAt`(`tokenCreatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token_validity` (
    `userId` INTEGER NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `validFrom` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`, `deviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
