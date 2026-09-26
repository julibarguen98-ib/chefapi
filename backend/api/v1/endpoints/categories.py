from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database.connection import get_db
from backend.schemas.category import CategoryCreate, CategoryResponse
from backend.crud import category as crud_category

router = APIRouter()


@router.get("/", response_model=List[CategoryResponse], summary="Obtener todas las categorías")
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_category.get_categories(db, skip=skip, limit=limit)


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED, summary="Crear una nueva categoría")
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return crud_category.create_category(db=db, category=category)