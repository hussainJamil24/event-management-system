from typing import List

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.event import (
    EventCreate,
    EventResponse,
    EventUpdate,
)
from app.services.event import (
    create_event,
    delete_event,
    get_all_events,
    get_event,
    get_events_by_category,
    update_event,
)

router = APIRouter(
    prefix="/events",
    tags=["Events"],
)


@router.post(
    "/",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_event(
        db=db,
        event_create=event,
        organizer_id=current_user.id,
    )


@router.get(
    "/",
    response_model=List[EventResponse],
)
def read_all_events(
    search: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
    ),
    db: Session = Depends(get_db),
):
    return get_all_events(
        db =db,
        search=search,
    )


@router.get(
    "/{event_id}",
    response_model=EventResponse,
)
def read_event(
    event_id: int,
    db: Session = Depends(get_db),
):
    return get_event(
        db=db,
        event_id=event_id,
    )


@router.get(
    "/category/{category_id}",
    response_model=List[EventResponse],
)
def read_events_by_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    return get_events_by_category(
        db=db,
        category_id=category_id,
    )


@router.put(
    "/{event_id}",
    response_model=EventResponse,
)
def update_existing_event(
    event_id: int,
    event_update: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = get_event(
        db=db,
        event_id=event_id,
    )

    if event.organizer_id != current_user.id:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to update this event.",
        )

    return update_event(
        db=db,
        event_id=event_id,
        event_update=event_update,
    )


@router.delete(
    "/{event_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = get_event(
        db=db,
        event_id=event_id,
    )

    if event.organizer_id != current_user.id:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to delete this event.",
        )

    delete_event(
        db=db,
        event_id=event_id,
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)