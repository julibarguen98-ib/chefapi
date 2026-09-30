from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class RecipeBase(BaseModel):
    title: str = Field(
        ...,
        min_length=3,
        max_length=120,
        description="Título de la receta"
    )

    description: Optional[str] = Field(
        None,
        max_length=500,
        description="Descripción de la receta"
    )
    
    image_url: Optional[str] = Field(
        None,
        max_length=500
    )

    prep_time_minutes: Optional[int] = Field(
        15,
        ge=1,
        description="Tiempo de preparación en minutos"
    )

    price: float = Field(
        ...,
        ge=0.0,
        description="Precio del plato"
    )

    category_id: int = Field(
        ...,
        description="ID de la categoría"
    )


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(BaseModel):
    title: Optional[str] = Field(
        None,
        min_length=3,
        max_length=120
    )

    description: Optional[str] = Field(
        None,
        max_length=500
    )

    image_url: Optional[str] = Field(
        None,
        max_length=500
    )

    prep_time_minutes: Optional[int] = Field(
        None,
        ge=1
    )

    price: Optional[float] = Field(
        None,
        ge=0.0
    )

    category_id: Optional[int] = None


class RecipeCategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class RecipeResponse(RecipeBase):
    id: int
    created_at: datetime
    category: Optional[RecipeCategoryResponse] = None

    model_config = ConfigDict(
        from_attributes=True
    )