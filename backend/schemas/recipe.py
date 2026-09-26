from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime
from backend.schemas.category import CategoryResponse


class RecipeBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=120, description="Título de la receta")
    description: Optional[str] = Field(None, max_length=500, description="Instrucciones o descripción")
    prep_time_minutes: Optional[int] = Field(15, ge=1, description="Tiempo de preparación en minutos")
    price: float = Field(..., ge=0.0, description="Precio del plato")
    category_id: int = Field(..., description="ID de la categoría a la que pertenece")


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=120)
    description: Optional[str] = Field(None, max_length=500)
    prep_time_minutes: Optional[int] = Field(None, ge=1)
    price: Optional[float] = Field(None, ge=0.0)
    category_id: Optional[int] = None


class RecipeResponse(RecipeBase):
    id: int
    created_at: datetime
    category: Optional[CategoryResponse] = None

    model_config = ConfigDict(from_attributes=True)