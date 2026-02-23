#!/bin/bash
# Run inside tripology-db container to create vendors table
set -e

docker exec tripology-db psql -U tripology -d tripology_db -c "
DROP TYPE IF EXISTS vendorstatus CASCADE;
DROP TYPE IF EXISTS vendortype CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DELETE FROM alembic_version WHERE version_num = '002_vendors';

CREATE TYPE vendortype AS ENUM ('hotel','airline','tour_agency','car_rental','restaurant','homestay','travel_insurance','visa_service','local_guide','transport','other');
CREATE TYPE vendorstatus AS ENUM ('pending','documents_required','under_review','approved','rejected','suspended');

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  business_name_fa VARCHAR(255),
  vendor_type vendortype NOT NULL,
  description TEXT,
  description_fa TEXT,
  phone VARCHAR(20) NOT NULL,
  website VARCHAR(500),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  license_number VARCHAR(100),
  national_id VARCHAR(20),
  tax_id VARCHAR(50),
  documents JSON DEFAULT '[]',
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  status vendorstatus NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  rejection_reason TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 15.00,
  total_listings INT DEFAULT 0,
  total_sales INT DEFAULT 0,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_type ON vendors(vendor_type);
CREATE INDEX idx_vendors_user ON vendors(user_id);
INSERT INTO alembic_version VALUES ('002_vendors');
"
echo "VENDORS TABLE CREATED"
