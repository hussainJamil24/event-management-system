from datetime import date, time

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.crud.event import get_all_events
from app.models.event import Event


# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)

    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def events(db):
    event_1 = Event(
        organizer_id=1,
        category_id=1,
        title="AI Conference 2026",
        description="A conference about artificial intelligence.",
        image="ai.jpg",
        location="Nicosia",
        event_date=date(2026, 10, 15),
        start_time=time(9, 0),
        end_time=time(17, 0),
        max_capacity=150,
        available_seats=150,
        status="published",
    )

    event_2 = Event(
        organizer_id=1,
        category_id=1,
        title="Web Development Workshop",
        description="Learn modern frontend and backend development.",
        image="web.jpg",
        location="Limassol",
        event_date=date(2026, 11, 10),
        start_time=time(10, 0),
        end_time=time(15, 0),
        max_capacity=50,
        available_seats=50,
        status="published",
    )

    event_3 = Event(
        organizer_id=2,
        category_id=2,
        title="Business Leadership Seminar",
        description="Leadership strategies for modern businesses.",
        image="business.jpg",
        location="Paphos",
        event_date=date(2026, 12, 5),
        start_time=time(9, 0),
        end_time=time(13, 0),
        max_capacity=100,
        available_seats=100,
        status="published",
    )

    db.add_all([
        event_1,
        event_2,
        event_3,
    ])

    db.commit()

    return [event_1, event_2, event_3]


def test_get_all_events_without_search(db, events):
    result = get_all_events(db)

    assert len(result) == 3

    assert result[0].title == "AI Conference 2026"
    assert result[1].title == "Web Development Workshop"
    assert result[2].title == "Business Leadership Seminar"


def test_get_all_events_matching_title(db, events):
    result = get_all_events(
        db,
        search="AI Conference",
    )

    assert len(result) == 1
    assert result[0].title == "AI Conference 2026"


def test_get_all_events_matching_description(db, events):
    result = get_all_events(
        db,
        search="artificial intelligence",
    )

    assert len(result) == 1
    assert result[0].title == "AI Conference 2026"


def test_get_all_events_matching_location(db, events):
    result = get_all_events(
        db,
        search="Limassol",
    )

    assert len(result) == 1
    assert result[0].title == "Web Development Workshop"
    assert result[0].location == "Limassol"


def test_get_all_events_case_insensitive(db, events):
    result = get_all_events(
        db,
        search="ai conference",
    )

    assert len(result) == 1
    assert result[0].title == "AI Conference 2026"


def test_get_all_events_no_results(db, events):
    result = get_all_events(
        db,
        search="Python Programming",
    )

    assert result == []