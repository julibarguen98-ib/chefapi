from fastapi import FastAPI

app = FastAPI(title="ChefAPI Engine")

@app.get("/")
def root():
    return {"message": "ChefAPI Online"}