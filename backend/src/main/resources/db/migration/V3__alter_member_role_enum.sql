-- Rename existing values first (so the ALTER can reference them)
UPDATE members SET role = 'USER'               WHERE role = 'CLIENT';
UPDATE members SET role = 'OUTSOURCING_PARTNER' WHERE role = 'FREELANCER';

-- Redefine the ENUM column to match the new UserRole values
ALTER TABLE members
  MODIFY COLUMN role ENUM('USER','OUTSOURCING_PARTNER','ADMIN') NOT NULL;
