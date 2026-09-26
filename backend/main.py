from fastapi import FastAPI
from backend.database.connection import Base, engine
from backend.models.category import Category

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChefAPI Engine")

@app.get("/")
def root():
    return {"message": "ChefAPI Online"}