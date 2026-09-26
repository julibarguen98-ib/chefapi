from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database.connection import get_db
from backend.schemas.recipe import RecipeCreate, RecipeResponse, RecipeUpdate
from backend.crud import recipe as crud_recipe
from backend.crud import category as crud_category

router = APIRouter()


@router.get("/", response_model=List[RecipeResponse], summary="Obtener todas las recetas")
def read_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_recipe.get_recipes(db, skip=skip, limit=limit)


@router.get("/{recipe_id}", response_model=RecipeResponse, summary="Obtener una receta por ID")
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = crud_recipe.get_recipe_by_id(db, recipe_id=recipe_id)
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return db_recipe


@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED, summary="Crear una receta")
def create_recipe(recipe: RecipeCreate, db: Session = Depends(get_db)):
    
    category = crud_category.get_category_by_id(db, category_id=recipe.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="La categoría especificada no existe")
    
    return crud_recipe.create_recipe(db=db, recipe=recipe)


@router.put("/{recipe_id}", response_model=RecipeResponse, summary="Actualizar una receta")
def update_recipe(recipe_id: int, recipe: RecipeUpdate, db: Session = Depends(get_db)):
    if recipe.category_id is not None:
        category = crud_category.get_category_by_id(db, category_id=recipe.category_id)
        if not category:
            raise HTTPException(status_code=400, detail="La categoría especificada no existe")

    updated_recipe = crud_recipe.update_recipe(db=db, recipe_id=recipe_id, recipe_update=recipe)
    if not updated_recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return updated_recipe


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Eliminar una receta")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    deleted_recipe = crud_recipe.delete_category(db=db, recipe_id=recipe_id)
    if not deleted_recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return None