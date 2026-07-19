from datetime import date

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.schemas.event import EventCreate, EventUpdate

from app.crud.event import (
    create_event as crud_create_event,
    get_event_by_id,
    get_all_events as crud_get_all_events,
    get_events_by_category as crud_get_events_by_category,
    update_event as crud_update_event,
)

from app.crud.category import get_category_by_id
from app.crud.user import get_user_by_id


def create_event(
    db: Session,
    event_create: EventCreate,
    organizer_id: int,
):
    # Check organizer exists
    db_user = get_user_by_id(
        db,
        organizer_id,
    )

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer not found.",
        )

    # Check category exists
    db_category = get_category_by_id(
        db,
        event_create.category_id,
    )

    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    # Event date cannot be in the past
    if event_create.event_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event date cannot be in the past.",
        )

    # Start time must be before end time
    if event_create.start_time >= event_create.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time.",
        )

    # Capacity must be greater than zero
    if event_create.max_capacity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Max capacity must be greater than zero.",
        )

    available_seats = event_create.max_capacity

    return crud_create_event(
        db=db,
        event=event_create,
        organizer_id=organizer_id,
        available_seats=available_seats,
    )

def get_event(db: Session, event_id: int):
    db_event = get_event_by_id(db, event_id)

    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    return db_event


def get_all_events(db: Session):
    return crud_get_all_events(db)


def get_events_by_category(db: Session, category_id: int):
    db_category = get_category_by_id(db, category_id)

    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    return crud_get_events_by_category(db, category_id)