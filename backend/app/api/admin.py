from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.api.auth import get_current_user

from app.schemas.admin import (
    DashboardStatistics,
    AdminEventCreate,
    AdminEventUpdate,
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