from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=80,
        description="Nombre de la categoría"
    )

    description: Optional[str] = Field(
        None,
        max_length=255,
        description="Descripción opcional"
    )

    icon: Optional[str] = Field(
        "restaurant",
        description="Icono representativo"
    )


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=80
    )

    description: Optional[str] = Field(
        None,
        max_length=255
    )

    icon: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class CategoryRecipeResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    price: float
    category_id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class CategoryDetailResponse(CategoryResponse):
    recipes: List[CategoryRecipeResponse] = []

    model_config = ConfigDict(
        from_attributes=True
    )