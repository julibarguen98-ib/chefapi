from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)
from sqlalchemy.orm import Session

from backend.database.connection import get_db
from backend.schemas.category import (
    CategoryCreate,
    CategoryResponse,
    CategoryDetailResponse,
    CategoryUpdate
)
from backend.crud import category as crud_category


router = APIRouter()


@router.get(
    "/",
    response_model=List[CategoryResponse],
    summary="Obtener todas las categorías"
)
def read_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud_category.get_categories(
        db,
        skip=skip,
        limit=limit
    )


@router.get(
    "/{category_id}",
    response_model=CategoryDetailResponse,
    summary="Obtener una categoría con sus recetas"
)
def read_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    category = crud_category.get_category_by_id(
        db,
        category_id=category_id
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    return category


@router.post(
    "/",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una nueva categoría"
)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db)
):
    return crud_category.create_category(
        db=db,
        category=category
    )


@router.put(
    "/{category_id}",
    response_model=CategoryResponse,
    summary="Actualizar una categoría"
)
def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db)
):
    updated_category = crud_category.update_category(
        db=db,
        category_id=category_id,
        category_update=category
    )

    if not updated_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    return updated_category


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar una categoría"
)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    deleted_category = crud_category.delete_category(
        db=db,
        category_id=category_id
    )

    if not deleted_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    return None