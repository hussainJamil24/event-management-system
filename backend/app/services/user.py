from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.user import UserCreate
from app.crud.user import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    UserUpdate,
    update_user,
    update_user,
)
from app.core.security import hash_password, verify_password
from app.core.security import hash_password, verify_password
from app.crud.user import get_user_by_id, update_password

def register_user(db: Session, user: UserCreate):
    # Check if the user already exists
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Hash the password
    hashed_password = hash_password(user.password)

    # Create the user
    new_user = create_user(
        db=db,
        user_create=user,
        hashed_password=hashed_password,
    )

    return new_user

def login_user(db: Session, email: str, password: str):
    # Find the user by email
    db_user = get_user_by_email(db, email)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Verify the password
    if not verify_password(password, db_user.password_hash,):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    return db_user

def change_password(
    db: Session,
    user_id: int,
    old_password: str,
    new_password: str,
):
    # Find the user
    db_user = get_user_by_id(db, user_id)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Verify current password
    if not verify_password(old_password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Old password is incorrect",
        )

    # Prevent using the same password
    if old_password == new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password.",
        )

    # Hash the new password
    hashed_password = hash_password(new_password)

    # Update password through the CRUD layer
    return update_password(
        db=db,
        db_user=db_user,
        hashed_password=hashed_password,
    )

def update_user_info(
    db: Session,
    user_id: int,
    user_update: UserUpdate,
):
    # Find the user
    db_user = get_user_by_id(db, user_id)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Update through the CRUD layer
    return update_user(
        db=db,
        db_user=db_user,
        user_update=user_update,
    )

def get_user_profile(db: Session, user_id: int):
    db_user = get_user_by_id(db, user_id)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return db_user