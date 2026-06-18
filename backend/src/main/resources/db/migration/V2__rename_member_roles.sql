-- Rename member roles: CLIENT→USER, FREELANCER→OUTSOURCING_PARTNER
-- Run BEFORE deploying the new backend version.
UPDATE members SET role = 'USER' WHERE role = 'CLIENT';
UPDATE members SET role = 'OUTSOURCING_PARTNER' WHERE role = 'FREELANCER';
