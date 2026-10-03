from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.crud.registration import (
    get_registration_by_id,
    update_registration as crud_update_registration,
)

from app.crud.event import (
    get_event_by_id,
    decrease_available_seat,
    increase_available_seat,
)

from app.schemas.registration import RegistrationUpdate

from app.models.registration import Registration


def update_admin_registration(
    db: Session,
    registration_id: int,
    registration_update: RegistrationUpdate,
) -> Registration:

    db_registration = get_registration_by_id(
        db,
        registration_id,
    )

    if not db_registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found.",
        )

    db_event = get_event_by_id(
        db,
        db_registration.event_id,
    )

    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    old_status = db_registration.status
    new_status = registration_update.status

    if old_status == new_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration is already {old_status}.",
        )

    try:

        # registered → cancelled
        if old_status == "registered" and new_status == "cancelled":

            seat_restored = increase_available_seat(
                db=db,
                event_id=db_event.id,
            )

            if not seat_restored:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unable to restore event capacity.",
                )

        # cancelled → registered
        elif old_status == "cancelled" and new_status == "registered":

            seat_reserved = decrease_available_seat(
                db=db,
                event_id=db_event.id,
            )

            if not seat_reserved:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No available seats.",
                )

        # registered → attended
        elif old_status == "registered" and new_status == "attended":

            pass

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Changing registration status from "
                    f"{old_status} to {new_status} is not allowed."
                ),
            )

        db_registration = crud_update_registration(
            db=db,
            db_registration=db_registration,
            registration_update=registration_update,
        )

        db.commit()
        db.refresh(db_registration)

        return db_registration

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise