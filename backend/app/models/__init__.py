from app.models.user import User
from app.models.category import Category
from app.models.event import Event
from app.models.registration import Registration

from app.core.database import Base, engine
import app.models

Base.metadata.create_all(bind=engine)