"""
Create or reset the admin user.
Run: python -m app.create_admin
"""
import asyncio
import logging
from sqlalchemy import select
from app.database import async_session, init_db
from app.models.user import User, UserRole
from app.core.security import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ADMIN_USERNAME = "admin"
ADMIN_EMAIL = "admin@tripology.com"
ADMIN_PASSWORD = "463310817hH*h"


async def create_admin():
    await init_db()

    async with async_session() as db:
        # Check if admin already exists (by username or email)
        result = await db.execute(
            select(User).where(
                (User.username == ADMIN_USERNAME) | (User.email == ADMIN_EMAIL)
            )
        )
        existing = result.scalar_one_or_none()

        if existing:
            # Update password and ensure admin role
            existing.hashed_password = hash_password(ADMIN_PASSWORD)
            existing.role = UserRole.ADMIN
            existing.is_active = True
            existing.is_verified = True
            existing.username = ADMIN_USERNAME
            existing.email = ADMIN_EMAIL
            await db.commit()
            logger.info("✅ Admin user updated — username: %s", ADMIN_USERNAME)
        else:
            # Create new admin
            admin = User(
                email=ADMIN_EMAIL,
                username=ADMIN_USERNAME,
                hashed_password=hash_password(ADMIN_PASSWORD),
                full_name="Tripology Admin",
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True,
            )
            db.add(admin)
            await db.commit()
            logger.info("✅ Admin user created — username: %s", ADMIN_USERNAME)


if __name__ == "__main__":
    asyncio.run(create_admin())
