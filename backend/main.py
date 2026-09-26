from fastapi import FastAPI
from backend.database.connection import Base, engine
from backend.models.category import Category
from backend.models.recipe import Recipe
from backend.api.v1.endpoints import categories, recipes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChefAPI Engine")

app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])

app.include_router(recipes.router, prefix="/api/v1/recipes", tags=["Recipes"])

@app.get("/")
def root():
    return {"message": "ChefAPI Online"}