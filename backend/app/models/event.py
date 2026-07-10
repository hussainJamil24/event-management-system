from sqlalchemy import Column, Enum, ForeignKey, Integer, String, Text, DateTime, Time, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    organizer_id = Column(
         Integer, 
         ForeignKey("users.id"), 
         nullable = False
    )
    
    category_id = Column( 
        Integer, 
        ForeignKey("categories.id"), 
        nullable = False
    )

    title = Column(
        String(100), 
        nullable = False
    )

    description = Column(
        Text, 
        nullable = True
    )

    image = Column(
        String(255), 
        nullable=True
    )

    location = Column(
        String(255), 
        nullable = True
    )

    event_date = Column(
        Date, 
        nullable=False
    )

    start_time = Column(
        Time, 
        nullable=False
    )

    end_time = Column(
        Time, 
        nullable=False
    )

    max_capacity = Column(
        Integer, 
        nullable=False
    )

    available_seats = Column(
        Integer, 
        nullable=False
    )

    status = Column(
        Enum("published", "draft", "cancelled", name="event_status")
    )

    created_at = Column(
        DateTime, 
        server_default=func.now()
    )

    updated_at = Column(
        DateTime, 
        server_default=func.now(), 
        onupdate=func.now()
    )

    organizer = relationship(
        "User",
        back_populates="events"
    )

    category = relationship(
        "Category",
        back_populates="events"
    )

    registrations = relationship(
        "Registration",
        back_populates="event"
    )

