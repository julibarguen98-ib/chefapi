from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship

from backend.database.connection import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(120),
        nullable=False,
        index=True
    )

    description = Column(
        String(500),
        nullable=True
    )

    image_url = Column(
        String(500),
        nullable=True)

    prep_time_minutes = Column(
        Integer,
        default=15
    )

    price = Column(
        Float,
        nullable=False,
        default=0.0
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    category = relationship(
        "Category",
        back_populates="recipes"
    )