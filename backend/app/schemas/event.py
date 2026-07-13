from datetime import date, datetime, time
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class EventBase(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=100,
    )

    description: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    status: Literal["draft", "published"] = Field(
        default="draft",
    )

    image: str = Field(
        min_length=1,
        max_length=255,
    )

    event_date: date

    start_time: time

    end_time: time

    max_capacity: int = Field(
        gt=0,
    )

    location: str = Field(
        min_length=3,
        max_length=255,
    )

    category_id: int = Field(
        gt=0,
    )


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    description: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    status: Optional[
        Literal["draft", "published", "cancelled"]
    ] = None

    image: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    event_date: Optional[date] = None

    start_time: Optional[time] = None

    end_time: Optional[time] = None

    max_capacity: Optional[int] = Field(
        default=None,
        gt=0,
    )

    location: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=255,
    )

    category_id: Optional[int] = Field(
        default=None,
        gt=0,
    )


class EventResponse(EventBase):
    id: int
    organizer_id: int
    available_seats: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )