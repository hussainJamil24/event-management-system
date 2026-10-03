from app.schemas.user import UserResponse, UserUpdate

from app.schemas.registration import (
    RegistrationResponse,
    RegistrationUpdate,
)

from app.services.admin_registration import (
    update_admin_registration,
)

from app.crud.admin_registration import (
    get_admin_registrations,
    get_admin_registration,
)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.api.auth import get_current_user

from app.schemas.user import UserResponse, UserUpdate

from app.crud.admin_user import (
    get_admin_users,
    get_admin_user,
    update_admin_user,
    delete_admin_user,
)

from app.schemas.admin import (
    DashboardStatistics,
    AdminEventCreate,
    AdminEventUpdate,
)

from app.schemas.category import (
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
)

from app.schemas.event import EventResponse
from app.crud.admin import get_dashboard_statistics

from app.crud.admin_event import (
    get_admin_events,
    get_admin_event,
    create_admin_event,
    update_admin_event,
    delete_admin_event,
)

from app.crud.admin_category import (
    get_admin_categories,
    get_admin_category,
    create_admin_category,
    update_admin_category,
    delete_admin_category,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# =========================
# Admin Authentication
# =========================

def get_current_admin(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required.",
        )

    return current_user


# =========================
# Dashboard
# =========================

@router.get(
    "/dashboard/stats",
    response_model=DashboardStatistics,
)
def dashboard_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return get_dashboard_statistics(db)


# =========================
# Admin Events
# =========================

@router.get(
    "/events",
    response_model=List[EventResponse],
)
def read_admin_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return get_admin_events(db)


@router.get(
    "/events/{event_id}",
    response_model=EventResponse,
)
def read_admin_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    event = get_admin_event(
        db=db,
        event_id=event_id,
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    return event


@router.post(
    "/events",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_event_as_admin(
    event_data: AdminEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    try:
        return create_admin_event(
            db=db,
            event_data=event_data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.put(
    "/events/{event_id}",
    response_model=EventResponse,
)
def update_event_as_admin(
    event_id: int,
    event_data: AdminEventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    event = get_admin_event(
        db=db,
        event_id=event_id,
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    try:
        return update_admin_event(
            db=db,
            db_event=event,
            event_data=event_data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.delete(
    "/events/{event_id}",
)
def delete_event_as_admin(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    event = get_admin_event(
        db=db,
        event_id=event_id,
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    delete_admin_event(
        db=db,
        db_event=event,
    )

    return {
        "message": "Event deleted successfully."
    }

# =========================
# Admin Categories
# =========================

@router.get(
    "/categories",
    response_model=List[CategoryResponse],
)
def read_admin_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return get_admin_categories(db)


@router.get(
    "/categories/{category_id}",
    response_model=CategoryResponse,
)
def read_admin_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    category = get_admin_category(
        db=db,
        category_id=category_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    return category


@router.post(
    "/categories",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_category_as_admin(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    try:
        return create_admin_category(
            db=db,
            category_data=category_data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.put(
    "/categories/{category_id}",
    response_model=CategoryResponse,
)
def update_category_as_admin(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    category = get_admin_category(
        db=db,
        category_id=category_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    try:
        return update_admin_category(
            db=db,
            db_category=category,
            category_data=category_data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.delete(
    "/categories/{category_id}",
)
def delete_category_as_admin(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    category = get_admin_category(
        db=db,
        category_id=category_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found.",
        )

    try:
        delete_admin_category(
            db=db,
            db_category=category,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    return {
        "message": "Category deleted successfully."
    }

# =========================
# Admin Users
# =========================

@router.get(
    "/users",
    response_model=List[UserResponse],
)
def read_admin_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return get_admin_users(db)


@router.get(
    "/users/{user_id}",
    response_model=UserResponse,
)
def read_admin_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    user = get_admin_user(
        db=db,
        user_id=user_id,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return user


@router.put(
    "/users/{user_id}",
    response_model=UserResponse,
)
def update_user_as_admin(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    user = get_admin_user(
        db=db,
        user_id=user_id,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return update_admin_user(
        db=db,
        db_user=user,
        user_data=user_data,
    )


@router.delete(
    "/users/{user_id}",
)
def delete_user_as_admin(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    user = get_admin_user(
        db=db,
        user_id=user_id,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    try:
        delete_admin_user(
            db=db,
            db_user=user,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    return {
        "message": "User deleted successfully."
    }

# =========================
# Admin Registrations
# =========================

@router.get(
    "/registrations",
    response_model=List[RegistrationResponse],
)
def read_admin_registrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return get_admin_registrations(db)


@router.get(
    "/registrations/{registration_id}",
    response_model=RegistrationResponse,
)
def read_admin_registration(
    registration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    registration = get_admin_registration(
        db=db,
        registration_id=registration_id,
    )

    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found.",
        )

    return registration

@router.put(
    "/registrations/{registration_id}",
    response_model=RegistrationResponse,
)
def update_registration_as_admin(
    registration_id: int,
    registration_update: RegistrationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return update_admin_registration(
        db=db,
        registration_id=registration_id,
        registration_update=registration_update,
    )


# =========================
# Admin Registrations
# =========================

@router.get(
    "/registrations",
    response_model=List[RegistrationResponse],
)
def read_admin_registrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return get_admin_registrations(db)


@router.get(
    "/registrations/{registration_id}",
    response_model=RegistrationResponse,
)
def read_admin_registration(
    registration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    registration = get_admin_registration(
        db=db,
        registration_id=registration_id,
    )

    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found.",
        )

    return registration


@router.put(
    "/registrations/{registration_id}",
    response_model=RegistrationResponse,
)
def update_registration_as_admin(
    registration_id: int,
    registration_update: RegistrationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return update_admin_registration(
        db=db,
        registration_id=registration_id,
        registration_update=registration_update,
    )