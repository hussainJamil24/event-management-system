from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String(50), nullable=False)

    last_name = Column(String(50), nullable=False)

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    role = Column(
    Enum("admin", "user", name="user_roles"),
        default="user",
        nullable=False
    )

    profile_image = Column(
        String(255),
        nullable=True
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

    events = relationship(
        "Event",
        back_populates="organizer"
    )
    
    registrations = relationship(
        "Registration",
        back_populates="user"
    )