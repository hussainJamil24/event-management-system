from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class RegistrationBase(BaseModel):
    event_id: int = Field(gt=0)


class RegistrationCreate(RegistrationBase):
    pass

class RegistrationUpdate(BaseModel):
    status: Literal[
        "registered",
        "cancelled",
        "attended",
    ]

class RegistrationResponse(RegistrationBase):
    id: int

    user_id: int

    status: Literal[
        "registered",
        "cancelled",
        "attended",
    ]

    registration_date: datetime

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )