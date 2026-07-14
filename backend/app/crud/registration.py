from sqlalchemy.orm import Session
from app.models.registration import Registration
from app.schemas.registration import RegistrationCreate, RegistrationUpdate

def create_registration(
    db: Session,
    registration: RegistrationCreate,
    user_id: int,
):
    db_registration = Registration(
        user_id=user_id,
        event_id=registration.event_id,
    )
    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)
    
    return db_registration

def get_registration(
    db: Session,
    user_id: int,
    event_id: int,
):
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
):
    db_registration.status = registration_update.status

    db.commit()
    db.refresh(db_registration)

    return db_registration