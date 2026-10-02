from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserUpdate


def get_admin_users(db: Session):
    return db.query(User).order_by(User.id).all()


def get_admin_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def update_admin_user(
    db: Session,
    db_user: User,
    user_data: UserUpdate,
):
    update_data = user_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)

    return db_user


def delete_admin_user(
    db: Session,
    db_user: User,
):
    if db_user.events:
        raise ValueError(
            "Cannot delete user because they are an organizer of one or more events."
        )

    if db_user.registrations:
        raise ValueError(
            "Cannot delete user because they have event registrations."
        )

    db.delete(db_user)
    db.commit()