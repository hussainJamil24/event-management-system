from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        unique=True,
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )

    events = relationship(
        "Event",
        back_populates="category",
    )