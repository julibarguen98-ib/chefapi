from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database.connection import Base, engine
from backend.models.category import Category
from backend.models.recipe import Recipe

from backend.api.v1.endpoints.categories import router as categories_router
from backend.api.v1.endpoints.recipes import router as recipes_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ChefAPI",
    version="1.0.0",
    description="API REST para gestión de categorías y recetas."
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    categories_router,
    prefix="/api/v1/categories",
    tags=["Categories"]
)

app.include_router(
    recipes_router,
    prefix="/api/v1/recipes",
    tags=["Recipes"]
)


@app.get("/")
def root():
    return {
        "status": "success",
        "message": "ChefAPI está funcionando"
    }