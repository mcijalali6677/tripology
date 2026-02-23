-- Add all missing columns to Users table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='PlainPassword') THEN
        ALTER TABLE "Users" ADD COLUMN "PlainPassword" TEXT;
        RAISE NOTICE 'Added PlainPassword';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='ShiftType') THEN
        ALTER TABLE "Users" ADD COLUMN "ShiftType" TEXT DEFAULT 'روزکار';
        RAISE NOTICE 'Added ShiftType';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='TechnicianStatusValue') THEN
        ALTER TABLE "Users" ADD COLUMN "TechnicianStatusValue" INTEGER;
        RAISE NOTICE 'Added TechnicianStatusValue';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='CurrentWorkOrderId') THEN
        ALTER TABLE "Users" ADD COLUMN "CurrentWorkOrderId" UUID;
        RAISE NOTICE 'Added CurrentWorkOrderId';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='StatusChangedAt') THEN
        ALTER TABLE "Users" ADD COLUMN "StatusChangedAt" TIMESTAMPTZ;
        RAISE NOTICE 'Added StatusChangedAt';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='EstimatedMinutesRemaining') THEN
        ALTER TABLE "Users" ADD COLUMN "EstimatedMinutesRemaining" INTEGER;
        RAISE NOTICE 'Added EstimatedMinutesRemaining';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='TwoFactorEnabled') THEN
        ALTER TABLE "Users" ADD COLUMN "TwoFactorEnabled" BOOLEAN NOT NULL DEFAULT FALSE;
        RAISE NOTICE 'Added TwoFactorEnabled';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='TwoFactorSecret') THEN
        ALTER TABLE "Users" ADD COLUMN "TwoFactorSecret" TEXT;
        RAISE NOTICE 'Added TwoFactorSecret';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='TwoFactorRecoveryCodes') THEN
        ALTER TABLE "Users" ADD COLUMN "TwoFactorRecoveryCodes" TEXT;
        RAISE NOTICE 'Added TwoFactorRecoveryCodes';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='TwoFactorEnabledAt') THEN
        ALTER TABLE "Users" ADD COLUMN "TwoFactorEnabledAt" TIMESTAMP;
        RAISE NOTICE 'Added TwoFactorEnabledAt';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='OAuthProvider') THEN
        ALTER TABLE "Users" ADD COLUMN "OAuthProvider" TEXT;
        RAISE NOTICE 'Added OAuthProvider';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='OAuthId') THEN
        ALTER TABLE "Users" ADD COLUMN "OAuthId" TEXT;
        RAISE NOTICE 'Added OAuthId';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='IsPurchaseManager') THEN
        ALTER TABLE "Users" ADD COLUMN "IsPurchaseManager" BOOLEAN NOT NULL DEFAULT FALSE;
        RAISE NOTICE 'Added IsPurchaseManager';
    END IF;
END $$;
