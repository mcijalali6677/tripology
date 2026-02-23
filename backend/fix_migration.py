import asyncio, os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def fix():
    url = os.environ.get("DATABASE_URL", "postgresql+asyncpg://tripology:tripology@localhost/tripology")
    e = create_async_engine(url)
    async with e.begin() as c:
        await c.execute(text("DROP TYPE IF EXISTS vendorstatus CASCADE"))
        await c.execute(text("DROP TYPE IF EXISTS vendortype CASCADE"))
        await c.execute(text("DROP TABLE IF EXISTS vendors CASCADE"))
        await c.execute(text("DELETE FROM alembic_version WHERE version_num = '002_vendors'"))
        print("CLEANED")
    await e.dispose()

asyncio.run(fix())
