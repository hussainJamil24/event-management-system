from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.category import get_category_by_id
from app.crud.event import (
    create_event as crud_create_event,
    delete_event as crud_delete_event,
    get_all_events as crud_get_all_events,
    get_event_by_id,
    get_events_by_category as crud_get_events_by_category,
    update_event as crud_update_event,
)
from app.crud.user import get_user_by_id
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate


def create_event(
    db: Session,
    event_create: EventCreate,
    organizer_id: int,
) -> Event:
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

    available_seats = event_create.max_capacity

    return crud_create_event(
        db=db,
        event=event_create,
        organizer_id=organizer_id,
        available_seats=available_seats,
    )


def get_event(
    db: Session,
    event_id: int,
) -> Event:
    db_event = get_event_by_id(
        db,
        event_id,
    )

    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    return db_event


def get_all_events(
    db: Session,
    search: str | None = None,
    categories: list[str] | None = None,
    location: str | None = None,
    timeframe: str | None = None,
    hide_sold_out: bool = False,
) -> list[Event]:
    return crud_get_all_events(
        db=db,
        search=search,
        categories=categories,
        location=location,
        timeframe=timeframe,
        hide_sold_out=hide_sold_out,
    )


def get_events_by_category(
    db: Session,
    category_id: int,
) -> list[Event]:
    db_category = get_category_by_id(
        db,
        category_id,
    )

    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    return crud_get_events_by_category(
        db,
        category_id,
    )


def update_event(
    db: Session,
    event_id: int,
    event_update: EventUpdate,
) -> Event:
    db_event = get_event_by_id(
        db,
        event_id,
    )

    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    if (
        event_update.event_date is not None
        and event_update.event_date < date.today()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event date cannot be in the past.",
        )

    start_time = (
        event_update.start_time
        if event_update.start_time is not None
        else db_event.start_time
    )

    end_time = (
        event_update.end_time
        if event_update.end_time is not None
        else db_event.end_time
    )

    if start_time >= end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time.",
        )

    if event_update.category_id is not None:
        db_category = get_category_by_id(
            db,
            event_update.category_id,
        )

        if not db_category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found.",
            )

    return crud_update_event(
        db=db,
        db_event=db_event,
        event_update=event_update,
    )


def delete_event(
    db: Session,
    event_id: int,
) -> None:
    db_event = get_event_by_id(
        db,
        event_id,
    )

    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    crud_delete_event(
        db=db,
        db_event=db_event,
    )