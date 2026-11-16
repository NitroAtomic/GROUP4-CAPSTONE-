-- ============================================================
-- 08-rename-client-data.sql
-- Group 4 Capstone 2, SE-AWARE
--
-- Expert review (Pena, Flores, Castro): ang "Secure Client Data
-- Handling" ay higit na nagtuturo ng executive impersonation at
-- pag-apruba ng access. Pinalitan ang pangalan para tugma sa laman.
--
-- Patakbuhin sa Workbench, o:
--   npm run db:migrate -- sql/08-rename-client-data.sql
-- Ligtas ulitin.
-- ============================================================

UPDATE `module`
   SET module_title = 'Executive Impersonation and Client Data',
       description  = 'Spotting fake boss or executive requests for client files, passwords and access.'
 WHERE slug = 'client-data';
