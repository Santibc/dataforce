-- ============================================================================
-- BosMetrics - Módulo de Chat Grupal
-- Schema SQL para MySQL
-- Generado: 2026-02-13
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Tabla: chat_groups
-- Almacena los grupos de chat (custom o global, bidireccional o unilateral)
-- ----------------------------------------------------------------------------
CREATE TABLE `chat_groups` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM('custom', 'global') NOT NULL,
    `mode` ENUM('bidirectional', 'unilateral') NOT NULL,
    `auto_add_new_members` TINYINT(1) NOT NULL DEFAULT 0,
    `show_history_to_new_members` TINYINT(1) NOT NULL DEFAULT 1,
    `company_id` BIGINT UNSIGNED NOT NULL,
    `created_by` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    `deleted_at` TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (`id`),
    INDEX `chat_groups_company_id_type_index` (`company_id`, `type`),

    CONSTRAINT `chat_groups_company_id_foreign`
        FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
        ON DELETE CASCADE,

    CONSTRAINT `chat_groups_created_by_foreign`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------------------
-- 2. Tabla: chat_group_members
-- Relación many-to-many entre grupos y usuarios.
-- left_at = NULL significa que el usuario está activo en el grupo.
-- ----------------------------------------------------------------------------
CREATE TABLE `chat_group_members` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `chat_group_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `joined_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `left_at` TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY `chat_group_members_group_user_unique` (`chat_group_id`, `user_id`),
    INDEX `chat_group_members_user_left_index` (`user_id`, `left_at`),

    CONSTRAINT `chat_group_members_chat_group_id_foreign`
        FOREIGN KEY (`chat_group_id`) REFERENCES `chat_groups` (`id`)
        ON DELETE CASCADE,

    CONSTRAINT `chat_group_members_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------------------
-- 3. Tabla: chat_messages
-- Almacena los mensajes de texto enviados en cada grupo.
-- company_id está desnormalizado para queries rápidos por empresa.
-- ----------------------------------------------------------------------------
CREATE TABLE `chat_messages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `chat_group_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `body` TEXT NOT NULL,
    `company_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (`id`),
    INDEX `chat_messages_group_created_index` (`chat_group_id`, `created_at`),
    INDEX `chat_messages_company_created_index` (`company_id`, `created_at`),

    CONSTRAINT `chat_messages_chat_group_id_foreign`
        FOREIGN KEY (`chat_group_id`) REFERENCES `chat_groups` (`id`)
        ON DELETE CASCADE,

    CONSTRAINT `chat_messages_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE,

    CONSTRAINT `chat_messages_company_id_foreign`
        FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------------------
-- 4. Tabla: chat_message_reads
-- Tracking del último mensaje leído por usuario en cada grupo.
-- Se usa para calcular el conteo de mensajes no leídos.
-- ----------------------------------------------------------------------------
CREATE TABLE `chat_message_reads` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `chat_group_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `last_read_message_id` BIGINT UNSIGNED NULL DEFAULT NULL,
    `read_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `chat_message_reads_group_user_unique` (`chat_group_id`, `user_id`),

    CONSTRAINT `chat_message_reads_chat_group_id_foreign`
        FOREIGN KEY (`chat_group_id`) REFERENCES `chat_groups` (`id`)
        ON DELETE CASCADE,

    CONSTRAINT `chat_message_reads_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE,

    CONSTRAINT `chat_message_reads_last_read_message_id_foreign`
        FOREIGN KEY (`last_read_message_id`) REFERENCES `chat_messages` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
