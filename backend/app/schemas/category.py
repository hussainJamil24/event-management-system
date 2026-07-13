from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

class CategoryBase(BaseModel):
    name: str = Field(
        min_length=3,
        max_length=100,
    )
     
    description: Optional[str] = Field(
        default=None,
        max_length=500,
    )

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    description: Optional[str] = Field(
        default=None,
        max_length=500,
    )

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )