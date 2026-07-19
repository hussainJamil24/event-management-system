from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.schemas.category import CategoryCreate, CategoryUpdate
from app.crud.category import (
    create_category as crud_create_category,
    get_category_by_id,
    get_category_by_name,
    get_all_categories as crud_get_all_categories,
    update_category as crud_update_category,
)


def create_category(
    db: Session,
    category_create: CategoryCreate,
):
    # Check if the category already exists
    db_category = get_category_by_name(
        db,
        category_create.name,
    )

    if db_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists.",
        )

    return crud_create_category(
        db=db,
        category=category_create,
    )


def update_category(
    db: Session,
    category_id: int,
    category_update: CategoryUpdate,
):
    # Find the category
    db_category = get_category_by_id(
        db,
        category_id,
    )

    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    # Check if the new name already exists
    if category_update.name is not None:
        existing_category = get_category_by_name(
            db,
            category_update.name,
        )

        if (
            existing_category
            and existing_category.id != category_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category already exists.",
            )

    return crud_update_category(
        db=db,
        db_category=db_category,
        category_update=category_update,
    )


def get_category(
    db: Session,
    category_id: int,
):
    db_category = get_category_by_id(
        db,
        category_id,
    )

    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    return db_category


def get_all_categories(db: Session):
    return crud_get_all_categories(db)