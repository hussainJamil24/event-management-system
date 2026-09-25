from sqlalchemy import or_
from datetime import date
from sqlalchemy.orm import Session
from dateutil.relativedelta import relativedelta

from app.models.event import Event
from app.models.category import Category
from app.schemas.event import EventCreate, EventUpdate


def create_event(
    db: Session,
    event: EventCreate,
    organizer_id: int,
    available_seats: int,
) -> Event:
    db_event = Event(
        organizer_id=organizer_id,
        category_id=event.category_id,
        title=event.title,
        description=event.description,
        image=event.image,
        location=event.location,
        event_date=event.event_date,
        start_time=event.start_time,
        end_time=event.end_time,
        max_capacity=event.max_capacity,
        available_seats=available_seats,
        status=event.status,
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return db_event


def get_event_by_id(
    db: Session,
    event_id: int,
) -> Event | None:
    return (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )


def get_all_events(
    db: Session,
    search: str | None = None,
    categories: list[str] | None = None,
    location: str | None = None,
    timeframe: str | None = None,
    hide_sold_out: bool = False,
) -> list[Event]:
    query = db.query(Event)

    #  Search filter
    if search:
        search_term = f"%{search}%"

        query = query.filter(
            or_(
                Event.title.ilike(search_term),
                Event.description.ilike(search_term),
                Event.location.ilike(search_term),
            )
        )

    # Category filter
    if categories:
        query = (
            query
            .join(Event.category)
            .filter(Category.name.in_(categories))
        )

    # Location filter
    if location:
        location_term = f"%{location}%"

        query = query.filter(
            Event.location.ilike(location_term)
        )

    # Timeframe filter
    today = date.today()

    if timeframe == "this_month":
        start_date = today.replace(day=1)

        if today.month == 12:
            next_month = date(today.year + 1, 1, 1)
        else:
            next_month = date( today.year, today.month + 1, 1)

        query = query.filter(
            Event.event_date >= start_date,
            Event.event_date < next_month,
        )

    elif timeframe == "next_month":
        start_date = today.replace(day=1) + relativedelta(months=1)
        end_date = start_date + relativedelta(months=1)

        query = query.filter(
            Event.event_date >= start_date,
            Event.event_date < end_date,
        )

    elif timeframe == "this_year":
        start_date = date(today.year, 1, 1)

        end_date = date(today.year + 1, 1, 1)

        query = query.filter(
            Event.event_date >= start_date,
            Event.event_date < end_date,
        )


    # Availability filter
    if hide_sold_out:
        query = query.filter( Event.available_seats > 0)

    # Sort by event date
    return (
        query
        .order_by(Event.event_date)
        .all()
    )


def get_events_by_category(
    db: Session,
    category_id: int,
) -> list[Event]:
    return (
        db.query(Event)
        .filter(Event.category_id == category_id)
        .order_by(Event.event_date)
        .all()
    )


def update_event(
    db: Session,
    db_event: Event,
    event_update: EventUpdate,
) -> Event:
    update_data = event_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)

    return db_event


def delete_event(
    db: Session,
    db_event: Event,
) -> None:
    db.delete(db_event)
    db.commit()