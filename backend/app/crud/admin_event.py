from sqlalchemy.orm import Session
from app.models.event import Event

from app.models.user import User
from app.models.category import Category


def get_admin_events(db: Session):
    return (
        db.query(Event)
        .order_by(Event.event_date)
        .all()
    )


def get_admin_event(
    db: Session,
    event_id: int,
):
    return (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )


def create_admin_event(
    db: Session,
    event_data,
):
    organizer = (
        db.query(User)
        .filter(User.id == event_data.organizer_id)
        .first()
    )

    if not organizer:
        raise ValueError(
            "Organizer not found."
        )

    category = (
        db.query(Category)
        .filter(Category.id == event_data.category_id)
        .first()
    )

    if not category:
        raise ValueError(
            "Category not found."
        )

    db_event = Event(
        organizer_id=event_data.organizer_id,
        category_id=event_data.category_id,
        title=event_data.title,
        description=event_data.description,
        image=event_data.image,
        event_date=event_data.event_date,
        start_time=event_data.start_time,
        end_time=event_data.end_time,
        max_capacity=event_data.max_capacity,
        available_seats=event_data.max_capacity,
        location=event_data.location,
        latitude=event_data.latitude,
        longitude=event_data.longitude,
        status=event_data.status,
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return db_event


def update_admin_event(
    db: Session,
    db_event: Event,
    event_data,
):
    update_data = event_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        if field == "max_capacity":
            continue

        setattr(db_event, field, value)

    if "max_capacity" in update_data:
        new_capacity = update_data["max_capacity"]

        registered_count = sum(
            1
            for registration in db_event.registrations
            if registration.status == "registered"
        )

        if new_capacity < registered_count:
            raise ValueError(
                "Maximum capacity cannot be lower than the number of registered attendees."
            )

        db_event.max_capacity = new_capacity
        db_event.available_seats = (
            new_capacity - registered_count
        )

    db.commit()
    db.refresh(db_event)

    return db_event


def delete_admin_event(
    db: Session,
    db_event: Event,
):
    db.delete(db_event)
    db.commit()