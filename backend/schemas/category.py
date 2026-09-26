from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=80, description="Nombre de la categoría")
    description: Optional[str] = Field(None, max_length=255, description="Descripción opcional")
    icon: Optional[str] = Field("restaurant", description="Icono representativo")


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)