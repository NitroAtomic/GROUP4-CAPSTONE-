-- ============================================================
-- Backend and integration: IamAtomic
-- 06 - Payment records
-- Web-Based Social Engineering Awareness Platform for Remote Workers
-- Group 4 - Capstone 2
--
-- Run AFTER 02-backend-additions.sql
--   mysql -u root < sql/06-payment.sql
--
-- Bakit kailangan nito:
--
-- Dati, isang PATCH /api/auth/me/subscription lang, Premium ka na. Walang
-- kahit anong patunay na may binayaran. Nasa browser lang yung card form,
-- kaya kahit sinong marunong mag-devtools, pwedeng laktawan yung bayad at
-- maging Premium agad.
--
-- Ngayon, walang Premium na walang kaukulang paid na row dito. Ang database
-- na mismo ang may hawak ng kasaysayan ng bayad, hindi yung browser.
-- ============================================================

USE `awareness_platform`;


-- ------------------------------------------------------------
-- 1. payment_transaction
--
-- Needed for: FR-10 (subscription management) at yung audit trail na
-- hinahanap sa papel -- sino nagbayad, magkano, kailan, anong reference.
--
-- Isang row kada subok mag-bayad, hindi lang yung mga nagtagumpay. Yung
-- 'pending' na naiwan ay ebidensya na may umabandona ng checkout, at yun
-- ang kailangan para hindi mabigay ang Premium sa kanila.
--
-- amount_centavos: sentimo, hindi piso. Ganito tumatanggap ng halaga ang
-- PayMongo (PHP 149.00 = 14900), at integer ang pera para walang
-- rounding error na dulot ng float.
--
-- reference_number: tayo gumagawa nito, hindi yung provider. Ito yung
-- hinahanap natin pabalik kapag nagre-redirect ang user o dumating ang
-- webhook. UNIQUE para hindi madoble ang pag-proseso ng iisang bayad.
--
-- provider_session_id: yung cs_... na id ng PayMongo checkout session.
-- Dito tayo tumitingin sa server kung talagang bayad na bago magbigay ng
-- Premium -- hindi sa sinasabi ng browser pagbalik niya.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment_transaction` (
  `transaction_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `reference_number` VARCHAR(64) NOT NULL,
  `provider` VARCHAR(32) NOT NULL DEFAULT 'paymongo',
  `provider_session_id` VARCHAR(128) DEFAULT NULL,
  `provider_payment_id` VARCHAR(128) DEFAULT NULL,
  `payment_method` VARCHAR(32) DEFAULT NULL,
  `billing_period` ENUM('monthly','yearly') NOT NULL,
  `amount_centavos` INT NOT NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'PHP',
  `status` ENUM('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  -- 0 = test mode. Mahalaga itong nakatala: ang buong UAT at defense ay
  -- sa test mode tatakbo, at dapat halata sa records kung alin yun.
  `livemode` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `paid_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  UNIQUE KEY `payment_reference_unique` (`reference_number`),
  KEY `payment_user_idx` (`user_id`),
  KEY `payment_session_idx` (`provider_session_id`),
  CONSTRAINT `payment_transaction_ibfk_1` FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ------------------------------------------------------------
-- 2. user.subscription_expires_at
--
-- Needed for: para may ibig sabihin yung Monthly at Yearly.
--
-- Kung walang petsa ng pagtatapos, pareho lang ang dalawang plano: walang
-- hanggang Premium pagkabayad nang minsan. Dito nakatala kung hanggang
-- kailan, at ito rin ang sinusuri bago payagan ang Premium na nilalaman.
-- ------------------------------------------------------------
ALTER TABLE `user`
  ADD COLUMN `subscription_expires_at` DATETIME DEFAULT NULL AFTER `subscription_status`;
