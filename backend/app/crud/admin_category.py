from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def get_admin_categories(
    db: Session,
):
    return (
        db.query(Category)
        .order_by(Category.name)
        .all()
    )


def get_admin_category(
    db: Session,
    category_id: int,
):
    return (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )


def create_admin_category(
    db: Session,
    category_data: CategoryCreate,
):
    existing_category = (
        db.query(Category)
        .filter(
            Category.name.ilike(category_data.name)
        )
        .first()
    )

    if existing_category:
        raise ValueError(
            "A category with this name already exists."
        )

    db_category = Category(
        name=category_data.name,
        description=category_data.description,
    )

    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return db_category


def update_admin_category(
    db: Session,
    db_category: Category,
    category_data: CategoryUpdate,
):
    update_data = category_data.model_dump(
        exclude_unset=True
    )

    if "name" in update_data:
        existing_category = (
            db.query(Category)
            .filter(
                Category.name.ilike(update_data["name"]),
                Category.id != db_category.id,
            )
            .first()
        )

        if existing_category:
            raise ValueError(
                "A category with this name already exists."
            )

    for field, value in update_data.items():
        setattr(db_category, field, value)

    db.commit()
    db.refresh(db_category)

    return db_category


def delete_admin_category(
    db: Session,
    db_category: Category,
):
    if db_category.events:
        raise ValueError(
            "Cannot delete category because it has associated events."
        )

    db.delete(db_category)
    db.commit()