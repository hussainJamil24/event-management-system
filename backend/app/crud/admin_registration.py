from sqlalchemy.orm import Session

from app.models.registration import Registration


def get_admin_registrations(db: Session):
    return (
        db.query(Registration)
        .order_by(Registration.registration_date.desc())
        .all()
    )


def get_admin_registration(
    db: Session,
    registration_id: int,
):
    return (
        db.query(Registration)
        .filter(Registration.id == registration_id)
        .first()
    )