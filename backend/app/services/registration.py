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
    get_registration_by_user_and_event,
    update_registration as crud_update_registration,
)

from app.crud.user import get_user_by_id
from app.crud.event import get_event_by_id


def create_registration(
    db: Session,
    registration_create: RegistrationCreate,
    user_id: int,
):
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

    # Check duplicate registration
    existing_registration = get_registration_by_user_and_event(
        db,
        user_id,
        registration_create.event_id,
    )

    if existing_registration:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already registered for this event.",
        )

    # Check available seats
    if db_event.available_seats <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No available seats.",
        )

    # TODO:
    # Decrease available seats through the Event CRUD layer.
    # (We'll add a CRUD helper for this later.)

    return crud_create_registration(
        db=db,
        registration=registration_create,
        user_id=user_id,
    )


def get_registration(
    db: Session,
    user_id: int,
    event_id: int,
):
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
):
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
):
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
):
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

    return crud_update_registration(
        db=db,
        db_registration=db_registration,
        registration_update=registration_update,
    )