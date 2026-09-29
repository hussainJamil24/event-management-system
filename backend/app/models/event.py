from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    Time,
    Float,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    organizer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=False,
    )

    title = Column(
        String(100),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    image = Column(
        String(255),
        nullable=True,
    )

    location = Column(
        String(255),
        nullable=True,
    )

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    event_date = Column(
        Date,
        nullable=False,
    )

    start_time = Column(
        Time,
        nullable=False,
    )

    end_time = Column(
        Time,
        nullable=False,
    )

    max_capacity = Column(
        Integer,
        nullable=False,
    )

    available_seats = Column(
        Integer,
        nullable=False,
    )

    status = Column(
        Enum(
            "draft",
            "published",
            "cancelled",
            name="event_status",
        ),
        nullable=False,
        default="draft",
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    organizer = relationship(
        "User",
        back_populates="events",
    )

    category = relationship(
        "Category",
        back_populates="events",
    )

    registrations = relationship(
        "Registration",
        back_populates="event",
        cascade="all, delete-orphan",
    )