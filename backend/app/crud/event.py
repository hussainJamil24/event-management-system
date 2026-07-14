from sqlalchemy.orm import Session
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate

def create_event(
    db: Session,
    event: EventCreate,
    organizer_id: int,
    available_seats: int,

):
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
):
    return db.query(Event).filter(Event.id == event_id).first()

def get_all_events(
    db: Session,
):
    return db.query(Event).order_by(Event.event_date).all()

def  get_events_by_category(
    db: Session,
    category_id: int,
):
    return db.query(Event).filter(Event.category_id == category_id).order_by(Event.event_date).all()

def update_event(
    db: Session,
    db_event: Event,
    event_update: EventUpdate,
):
    if event_update.title is not None:
        db_event.title = event_update.title

    if event_update.description is not None:
        db_event.description = event_update.description

    if event_update.image is not None:
        db_event.image = event_update.image

    if event_update.location is not None:
        db_event.location = event_update.location

    if event_update.event_date is not None:
        db_event.event_date = event_update.event_date

    if event_update.start_time is not None:
        db_event.start_time = event_update.start_time

    if event_update.end_time is not None:
        db_event.end_time = event_update.end_time

    if event_update.max_capacity is not None:
        db_event.max_capacity = event_update.max_capacity

    if event_update.status is not None:
        db_event.status = event_update.status

    if event_update.category_id is not None:
        db_event.category_id = event_update.category_id

    db.commit()
    db.refresh(db_event)

    return db_event