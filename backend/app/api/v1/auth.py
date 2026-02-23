"""Auth endpoints — Register, Login, Refresh, Logout."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
)
from app.core.dependencies import get_current_user
from app.models.user import User, RefreshToken
from app.schemas.user import (
    RegisterRequest, LoginRequest, TokenResponse,
    RefreshRequest, UserResponse,
)
from app.config import get_settings

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    # Check if email exists
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # Check if username exists
    existing = await db.execute(select(User).where(User.username == data.username))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Username already taken")
    
    # Create user
    user = User(
        email=data.email,
        username=data.username,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    await db.flush()
    
    # Generate tokens
    access_token = create_access_token(user.id, user.role.value)
    refresh_token = create_refresh_token(user.id)
    
    # Store refresh token
    rt = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.fromtimestamp(
            decode_token(refresh_token)["exp"], tz=timezone.utc
        ),
        device_type=data.device_type,
        device_name=data.device_name,
    )
    db.add(rt)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login with email and password."""
    # Allow login by email or username
    identifier = data.email or data.username
    if not identifier:
        raise HTTPException(status_code=422, detail="Email or username is required")
    
    result = await db.execute(
        select(User).where(
            (User.email == identifier) | (User.username == identifier)
        )
    )
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")
    
    # Update last login
    user.last_login = datetime.now(timezone.utc)
    
    # Generate tokens
    access_token = create_access_token(user.id, user.role.value)
    refresh_token = create_refresh_token(user.id)
    
    # Store refresh token
    rt = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.fromtimestamp(
            decode_token(refresh_token)["exp"], tz=timezone.utc
        ),
        device_type=data.device_type,
        device_name=data.device_name,
    )
    db.add(rt)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """Get a new access token using refresh token."""
    payload = decode_token(data.refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    # Check if token exists and not revoked
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token == data.refresh_token,
            RefreshToken.is_revoked == False,
        )
    )
    stored_token = result.scalar_one_or_none()
    if not stored_token:
        raise HTTPException(status_code=401, detail="Refresh token revoked or expired")
    
    # Get user
    user_id = payload["sub"]
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Revoke old refresh token
    stored_token.is_revoked = True
    
    # Issue new tokens
    new_access = create_access_token(user.id, user.role.value)
    new_refresh = create_refresh_token(user.id)
    
    rt = RefreshToken(
        user_id=user.id,
        token=new_refresh,
        expires_at=datetime.fromtimestamp(
            decode_token(new_refresh)["exp"], tz=timezone.utc
        ),
        device_type=stored_token.device_type,
        device_name=stored_token.device_name,
    )
    db.add(rt)
    
    return TokenResponse(
        access_token=new_access,
        refresh_token=new_refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/logout")
async def logout(
    data: RefreshRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Logout — revoke refresh token."""
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token == data.refresh_token,
            RefreshToken.user_id == user.id,
        )
    )
    token = result.scalar_one_or_none()
    if token:
        token.is_revoked = True
    
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    """Get current user profile."""
    return user
