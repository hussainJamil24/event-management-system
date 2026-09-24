from sqlalchemy import or_
from sqlalchemy.orm import Session

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
    category: str | None = None,
    location: str | None = None,
) -> list[Event]:
    query = db.query(Event)

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
    if category:
        query = (
            query
            .join(Event.category)
            .filter(Category.name.ilike(category))
        )

    # Location filter
    if location:
        location_term = f"%{location}%"

        query = query.filter(
            Event.location.ilike(location_term)
        )

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