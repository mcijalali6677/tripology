"""User profile endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, PersonalityQuizResult

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_profile(user: User = Depends(get_current_user)):
    """Get own profile."""
    return user


@router.patch("/me", response_model=UserResponse)
async def update_profile(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update own profile."""
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    return user


@router.post("/me/personality", response_model=UserResponse)
async def save_personality_quiz(
    data: PersonalityQuizResult,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Save personality quiz results."""
    user.personality_scores = data.model_dump()
    return user


@router.get("/{username}", response_model=UserResponse)
async def get_user_by_username(
    username: str,
    db: AsyncSession = Depends(get_db),
):
    """Get public user profile."""
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
