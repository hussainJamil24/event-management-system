from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.event import Event
from app.models.user import User
from app.models.category import Category
from app.models.registration import Registration


def get_dashboard_statistics(db: Session):
    total_events = db.query(func.count(Event.id)).scalar() or 0

    total_users = db.query(func.count(User.id)).scalar() or 0

    total_registrations = (
        db.query(func.count(Registration.id)).scalar() or 0
    )

    total_categories = (
        db.query(func.count(Category.id)).scalar() or 0
    )

    events_by_category = (
        db.query(
            Category.name,
            func.count(Event.id),
        )
        .outerjoin(Event, Event.category_id == Category.id)
        .group_by(Category.id, Category.name)
        .order_by(func.count(Event.id).desc())
        .all()
    )

    return {
        "total_events": total_events,
        "total_users": total_users,
        "total_registrations": total_registrations,
        "total_categories": total_categories,
        "events_by_category": [
            {
                "category": category_name,
                "count": event_count,
            }
            for category_name, event_count in events_by_category
        ],
    }