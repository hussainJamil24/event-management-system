from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

def create_category(
        db: Session,
        category: CategoryCreate,
):
    db_category = Category(
        name=category.name,
        description=category.description,   
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_category_by_id(
    db: Session,
    category_id: int,
):
     return db.query(Category).filter(Category.id == category_id).first()

def get_category_by_name(
    db: Session,
    name: str,
):
    return db.query(Category).filter(func.lower(Category.name) == name.lower()).first()

def get_all_categories(
    db: Session,
):
    return db.query(Category) .order_by(Category.name).all()

def update_category(
    db: Session,
    db_category: Category,
    category_update: CategoryUpdate,
):
    if category_update.name is not None:
        db_category.name = category_update.name
    if category_update.description is not None:
        db_category.description = category_update.description

    db.commit()
    db.refresh(db_category)
    return db_category