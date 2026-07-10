from sqlalchemy import Column, Enum, ForeignKey, Integer, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class Registration(Base):

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "event_id",
            name="uq_user_event_registration",
        ),
    )
    
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
         Integer, 
         ForeignKey("users.id"), 
         nullable = False
    )

    event_id = Column(
         Integer, 
         ForeignKey("events.id"), 
         nullable = False
    )

    registration_date = Column(
        DateTime, 
        server_default=func.now()
    )

    status = Column(
        Enum("registered", "cancelled", "attended", name="registration_status"),
        default="registered",
        nullable=False
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

    user = relationship(
        "User",
        back_populates="registrations"
    )

    event = relationship(
        "Event",
        back_populates="registrations"
    )