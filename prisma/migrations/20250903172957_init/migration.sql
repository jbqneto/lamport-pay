-- CreateTable
CREATE TABLE `Merchant` (
    `id` VARCHAR(64) NOT NULL,
    `ownerId` VARCHAR(64) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(1024) NULL,
    `website` VARCHAR(255) NULL,
    `avatarUrl` VARCHAR(255) NULL,
    `contactEmail` VARCHAR(255) NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(64) NOT NULL,
    `merchantId` VARCHAR(64) NOT NULL,
    `amount` DECIMAL(30, 6) NOT NULL,
    `coin` ENUM('USDC', 'USDT') NOT NULL,
    `destination` VARCHAR(128) NOT NULL,
    `status` ENUM('CREATED', 'CONFIRMED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'CREATED',
    `validUntil` DATETIME(3) NOT NULL,
    `memo` VARCHAR(140) NULL,
    `signature` VARCHAR(128) NULL,
    `payer` VARCHAR(128) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_signature_key`(`signature`),
    INDEX `Invoice_status_merchantId_idx`(`status`, `merchantId`),
    INDEX `Invoice_status_validUntil_idx`(`status`, `validUntil`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(64) NOT NULL,
    `invoiceId` VARCHAR(64) NOT NULL,
    `amount` DECIMAL(30, 6) NOT NULL,
    `stablecoin` ENUM('USDC', 'USDT') NOT NULL,
    `destination` VARCHAR(128) NOT NULL,
    `mintAddress` VARCHAR(128) NOT NULL,
    `reference` VARCHAR(128) NOT NULL,
    `signature` VARCHAR(128) NULL,
    `slot` BIGINT NULL,
    `payer` VARCHAR(128) NULL,
    `status` ENUM('PENDING', 'SEEN', 'VALID', 'INVALID', 'ERROR') NOT NULL DEFAULT 'PENDING',
    `error` VARCHAR(1024) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `validatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Payment_reference_key`(`reference`),
    UNIQUE INDEX `Payment_signature_key`(`signature`),
    INDEX `Payment_invoiceId_idx`(`invoiceId`),
    INDEX `Payment_reference_idx`(`reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `Merchant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
