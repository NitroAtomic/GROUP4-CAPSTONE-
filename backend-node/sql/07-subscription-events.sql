-- ============================================================
-- 07-subscription-events.sql
-- Group 4 Capstone 2, SE-AWARE
--
-- Talaan ng pag-cancel at pagbawi ng cancel.
--
-- Ang payment_transaction ay para sa pera lang: sino nagbayad, magkano,
-- kailan. Pero ang pag-cancel ay walang perang gumagalaw, kaya dati
-- wala itong bakas -- nagbabago lang ang status ng account, at nawawala
-- kung kailan at ilang beses. Dito na iyon nakatala.
--
-- Isang row kada pindot:
--   cancelled  -- nag-cancel. access_until = hanggang kailan pa siya
--                 Premium. NULL kung agad siyang naging Free (lumang
--                 demo account na walang binayarang panahon).
--   resumed    -- pinindot ang "Keep Premium" bago matapos ang petsa.
--
-- Patakbuhin sa Workbench, o:
--   npm run db:migrate -- sql/07-subscription-events.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS `subscription_event` (
  `event_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `event_type` ENUM('cancelled','resumed') NOT NULL,
  `access_until` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `subscription_event_user_idx` (`user_id`),
  KEY `subscription_event_created_idx` (`created_at`),
  CONSTRAINT `subscription_event_ibfk_1` FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
