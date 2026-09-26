from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from backend.database.connection import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    icon = Column(String(50), default="restaurant")
    created_at = Column(DateTime, default=datetime.utcnow)
    recipes = relationship("Recipe", back_populates="category", cascade="all, delete-orphan")