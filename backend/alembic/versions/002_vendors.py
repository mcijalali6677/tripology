"""create vendors table

Revision ID: 002_vendors
Revises: 
Create Date: 2026-02-23
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = '002_vendors'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vendortype') THEN
                CREATE TYPE vendortype AS ENUM (
                    'hotel', 'airline', 'tour_agency', 'car_rental', 'restaurant',
                    'homestay', 'travel_insurance', 'visa_service', 'local_guide',
                    'transport', 'other'
                );
            END IF;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vendorstatus') THEN
                CREATE TYPE vendorstatus AS ENUM (
                    'pending', 'documents_required', 'under_review',
                    'approved', 'rejected', 'suspended'
                );
            END IF;
        END $$;
    """)

    op.create_table(
        'vendors',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('business_name', sa.String(255), nullable=False),
        sa.Column('business_name_fa', sa.String(255), nullable=True),
        sa.Column('vendor_type', sa.Enum('hotel', 'airline', 'tour_agency', 'car_rental', 'restaurant', 'homestay', 'travel_insurance', 'visa_service', 'local_guide', 'transport', 'other', name='vendortype', create_type=False), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('description_fa', sa.Text, nullable=True),
        sa.Column('phone', sa.String(20), nullable=False),
        sa.Column('website', sa.String(500), nullable=True),
        sa.Column('address', sa.Text, nullable=True),
        sa.Column('city', sa.String(100), nullable=True),
        sa.Column('province', sa.String(100), nullable=True),
        sa.Column('license_number', sa.String(100), nullable=True),
        sa.Column('national_id', sa.String(20), nullable=True),
        sa.Column('tax_id', sa.String(50), nullable=True),
        sa.Column('documents', sa.JSON, server_default='[]'),
        sa.Column('logo_url', sa.String(500), nullable=True),
        sa.Column('banner_url', sa.String(500), nullable=True),
        sa.Column('status', sa.Enum('pending', 'documents_required', 'under_review', 'approved', 'rejected', 'suspended', name='vendorstatus', create_type=False), server_default='pending', nullable=False),
        sa.Column('verified_at', sa.DateTime, nullable=True),
        sa.Column('rejection_reason', sa.Text, nullable=True),
        sa.Column('admin_notes', sa.Text, nullable=True),
        sa.Column('commission_rate', sa.Float, server_default='15.0'),
        sa.Column('total_listings', sa.Float, server_default='0'),
        sa.Column('total_sales', sa.Float, server_default='0'),
        sa.Column('total_revenue', sa.Float, server_default='0'),
        sa.Column('rating', sa.Float, server_default='0'),
        sa.Column('review_count', sa.Float, server_default='0'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index('idx_vendors_status', 'vendors', ['status'])
    op.create_index('idx_vendors_type', 'vendors', ['vendor_type'])
    op.create_index('idx_vendors_user', 'vendors', ['user_id'])


def downgrade() -> None:
    op.drop_table('vendors')
    op.execute("DROP TYPE IF EXISTS vendortype")
    op.execute("DROP TYPE IF EXISTS vendorstatus")
