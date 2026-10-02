from datetime import date, time
from pydantic import BaseModel, ConfigDict


class EventsByCategory(BaseModel):
    category: str
    count: int


class DashboardStatistics(BaseModel):
    total_events: int
    total_users: int
    total_registrations: int
    total_categories: int
    events_by_category: list[EventsByCategory]

class AdminEventCreate(BaseModel):
    organizer_id: int
    category_id: int

    title: str
    description: str | None = None
    image: str | None = None

    event_date: date
    start_time: time
    end_time: time

    max_capacity: int

    location: str

    latitude: float | None = None
    longitude: float | None = None

    status: str = "draft"


class AdminEventUpdate(BaseModel):
    organizer_id: int | None = None
    category_id: int | None = None

    title: str | None = None
    description: str | None = None
    image: str | None = None

    event_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None

    max_capacity: int | None = None

    location: str | None = None

    latitude: float | None = None
    longitude: float | None = None

    status: str | None = None