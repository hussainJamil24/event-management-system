from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.schemas.registration import (
    RegistrationCreate,
    RegistrationUpdate,
)

from app.crud.registration import (
    create_registration as crud_create_registration,
    get_registration as crud_get_registration,
    get_registrations_by_user as crud_get_registrations_by_user,
    get_registrations_by_event as crud_get_registrations_by_event,
    update_registration as crud_update_registration,
)

from app.crud.user import get_user_by_id
from app.crud.event import (
    get_event_by_id,
    decrease_available_seat,
    increase_available_seat,
)
from app.models.registration import Registration


def create_registration(
    db: Session,
    registration_create: RegistrationCreate,
    user_id: int,
) -> Registration:
    # Check user exists
    db_user = get_user_by_id(
        db,
        user_id,
    )

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    # Check event exists
    db_event = get_event_by_id(
        db,
        registration_create.event_id,
    )

    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    # Event must be published
    if db_event.status != "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is not open for registration.",
        )

    # Check existing registration
    existing_registration = crud_get_registration(
        db,
        user_id,
        registration_create.event_id,
    )

    # User is already registered
    if existing_registration and existing_registration.status == "registered":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already registered for this event.",
        )

    # User previously cancelled and wants to register again
    if existing_registration and existing_registration.status == "cancelled":
        try:
            # Reserve a seat again
            seat_reserved = decrease_available_seat(
                db=db,
                event_id=db_event.id,
            )

            if not seat_reserved:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No available seats.",
                )

            # Change cancelled registration back to registered
            db_registration = crud_update_registration(
                db=db,
                db_registration=existing_registration,
                registration_update=RegistrationUpdate(
                    status="registered"
                ),
            )

            # Commit seat + registration together
            db.commit()

            db.refresh(db_registration)

            return db_registration

        except HTTPException:
            db.rollback()
            raise

        except Exception:
            db.rollback()
            raise

    # New registration
    try:
        # Reserve a seat
        seat_reserved = decrease_available_seat(
            db=db,
            event_id=db_event.id,
        )

        if not seat_reserved:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No available seats.",
            )

        # Create new registration
        db_registration = crud_create_registration(
            db=db,
            registration=registration_create,
            user_id=user_id,
        )

        # Commit seat + registration together
        db.commit()

        db.refresh(db_registration)

        return db_registration

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise
    

def get_registration(
    db: Session,
    user_id: int,
    event_id: int,
) -> Registration:
    db_registration = crud_get_registration(
        db,
        user_id,
        event_id,
    )

    if not db_registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found.",
        )

    return db_registration


def get_registrations_by_user(
    db: Session,
    user_id: int,
) -> list[Registration]:
    db_user = get_user_by_id(
        db,
        user_id,
    )

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return crud_get_registrations_by_user(
        db,
        user_id,
    )


def get_registrations_by_event(
    db: Session,
    event_id: int,
) -> list[Registration]:
    db_event = get_event_by_id(
        db,
        event_id,
    )

    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    return crud_get_registrations_by_event(
        db,
        event_id,
    )


def update_registration(
    db: Session,
    user_id: int,
    event_id: int,
    registration_update: RegistrationUpdate,
) -> Registration:
    db_registration = crud_get_registration(
        db,
        user_id,
        event_id,
    )

    if not db_registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found.",
        )

    old_status = db_registration.status
    new_status = registration_update.status

    try:
        # Registered → Cancelled
        if old_status == "registered" and new_status == "cancelled":
            seat_restored = increase_available_seat(
                db=db,
                event_id=event_id,
            )

            if not seat_restored:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unable to restore event capacity.",
                )

        # Prevent cancelling an already cancelled registration
        elif old_status == "cancelled" and new_status == "cancelled":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration is already cancelled.",
            )

        # Update registration status
        db_registration = crud_update_registration(
            db=db,
            db_registration=db_registration,
            registration_update=registration_update,
        )

        # Commit status + seat change together
        db.commit()

        db.refresh(db_registration)

        return db_registration

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise