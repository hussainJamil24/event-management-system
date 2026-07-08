from fastapi import FastAPI
from sqlalchemy import text

from app.core.database import engine

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Event Management System API"}

@app.get("/test-db")
def test_database():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"message": "Database connection successful!"}
    except Exception as e:
        return {"error": str(e)}