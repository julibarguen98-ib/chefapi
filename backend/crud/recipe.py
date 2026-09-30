from sqlalchemy.orm import Session

from backend.models.recipe import Recipe
from backend.schemas.recipe import (
    RecipeCreate,
    RecipeUpdate
)


def get_recipes(
    db: Session,
    skip: int = 0,
    limit: int = 100
):
    return (
        db.query(Recipe)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_recipe_by_id(
    db: Session,
    recipe_id: int
):
    return (
        db.query(Recipe)
        .filter(Recipe.id == recipe_id)
        .first()
    )


def create_recipe(
    db: Session,
    recipe: RecipeCreate
):
    db_recipe = Recipe(
        title=recipe.title,
        description=recipe.description,
        image_url=recipe.image_url,
        prep_time_minutes=recipe.prep_time_minutes,
        price=recipe.price,
        category_id=recipe.category_id
    )

    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)

    return db_recipe


def update_recipe(
    db: Session,
    recipe_id: int,
    recipe_update: RecipeUpdate
):
    db_recipe = get_recipe_by_id(
        db,
        recipe_id
    )

    if not db_recipe:
        return None

    update_data = recipe_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_recipe, key, value)

    db.commit()
    db.refresh(db_recipe)

    return db_recipe


def delete_recipe(
    db: Session,
    recipe_id: int
):
    db_recipe = get_recipe_by_id(
        db,
        recipe_id
    )

    if not db_recipe:
        return None

    db.delete(db_recipe)
    db.commit()

    return db_recipe