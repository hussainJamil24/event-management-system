from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def get_user_by_email(
    db: Session,
    email: str,
):
    return db.query(User).filter(User.email == email).first()

def create_user(
    db: Session,
    user: UserCreate,
    hashed_password: str,
): 
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_id(
    db: Session,
    user_id: int,
):
    return db.query(User).filter(User.id == user_id).first()

def update_user(
    db: Session,
    db_user: User,
    user_update: UserUpdate,
):
    if user_update.first_name is not None:
        db_user.first_name = user_update.first_name
    if user_update.last_name is not None:
        db_user.last_name = user_update.last_name
    if user_update.profile_image is not None:
        db_user.profile_image = user_update.profile_image

    db.commit()
    db.refresh(db_user)
    return db_user