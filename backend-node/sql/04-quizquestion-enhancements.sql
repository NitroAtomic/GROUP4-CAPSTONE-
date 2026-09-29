-- ============================================================
-- 04-quizquestion-enhancements.sql
-- FR-18: Rich quiz-question data support
--
-- PRESERVATION RULE:
-- This migration ONLY ADDS columns.
-- Existing quizquestion columns are preserved.
--
-- Existing columns:
--   question_id
--   quiz_id
--   question_text
--   options
--   correct_option_index
--   order_index
--
-- Added columns:
--   category
--   question_type
--   answer_type
--   correct_answer
--   explanation
--   points_correct
--   points_incorrect
--
-- The existing learner quiz is NOT changed by this migration.
-- ============================================================

USE `awareness_platform`;

ALTER TABLE `quizquestion`
  ADD COLUMN `category` VARCHAR(100) NULL AFTER `question_text`,
  ADD COLUMN `question_type` VARCHAR(50) NULL AFTER `category`,
  ADD COLUMN `answer_type` VARCHAR(20) NULL AFTER `question_type`,
  ADD COLUMN `correct_answer` JSON NULL AFTER `correct_option_index`,
  ADD COLUMN `explanation` TEXT NULL AFTER `correct_answer`,
  ADD COLUMN `points_correct` INT NULL AFTER `explanation`,
  ADD COLUMN `points_incorrect` INT NULL AFTER `points_correct`;
