from sqlalchemy.orm import Session
from app.models.registration import Registration
from app.schemas.registration import RegistrationCreate, RegistrationUpdate
from typing import Optional

def create_registration(
    db: Session,
    registration: RegistrationCreate,
    user_id: int,
) -> Registration:
    db_registration = Registration(
        user_id=user_id,
        event_id=registration.event_id,
    )

    db.add(db_registration)

    return db_registration

def get_registration(
    db: Session,
    user_id: int,
    event_id: int,
)  -> Optional[Registration]:
        return (
            db.query(Registration)
            .filter(
                Registration.user_id == user_id,
                Registration.event_id == event_id,
            )
            .first()
        )

def get_registrations_by_user(
    db: Session,
    user_id: int,
):
    return (
        db.query(Registration)
        .filter(Registration.user_id == user_id)
        .all()
    )

def get_registration_by_id(
    db: Session,
    registration_id: int,
):
    return (
        db.query(Registration)
        .filter(Registration.id == registration_id)
        .first()
    )

def get_registrations_by_event(
    db: Session,
    event_id: int,
):
    return (
        db.query(Registration)
        .filter(Registration.event_id == event_id)
        .all()
    )

def update_registration(
    db: Session,
    db_registration: Registration,
    registration_update: RegistrationUpdate,
) -> Registration:
    db_registration.status = registration_update.status

    return db_registration

def delete_registration(
    db: Session,
    db_registration: Registration,
):
    db.delete(db_registration)
    db.commit()