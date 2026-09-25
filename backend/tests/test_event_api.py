from datetime import date, time

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app
from app.models.category import Category
from app.models.event import Event
from unittest.mock import patch


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"


engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


client = TestClient(app)


def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    # -----------------------------
    # Categories
    # -----------------------------
    technology = Category(
        name="Technology",
        description="Technology related events.",
    )

    business = Category(
        name="Business",
        description="Business related events.",
    )

    db.add_all([
        technology,
        business,
    ])

    db.commit()

    # -----------------------------
    # Events
    # -----------------------------
    event_1 = Event(
        organizer_id=1,
        category_id=technology.id,
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
        category_id=technology.id,
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
        category_id=business.id,
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

    event_4 = Event(
        organizer_id=1,
        category_id=technology.id,
        title="Sold Out Technology Event",
        description="This event has no available seats.",
        image="soldout.jpg",
        location="Nicosia",
        event_date=date(2026, 10, 20),
        start_time=time(10, 0),
        end_time=time(14, 0),
        max_capacity=100,
        available_seats=0,
        status="published",
    )

    db.add_all([
        event_1,
        event_2,
        event_3,
        event_4,
    ])

    db.commit()
    db.close()

def teardown_database():
    Base.metadata.drop_all(bind=engine)


# ============================================================
# Basic events
# ============================================================

def test_get_all_events_without_search():
    setup_database()

    response = client.get("/events/")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 4

    assert data[0]["title"] == "AI Conference 2026"
    assert data[1]["title"] == "Sold Out Technology Event"
    assert data[2]["title"] == "Web Development Workshop"
    assert data[3]["title"] == "Business Leadership Seminar"

    teardown_database()


# ============================================================
# Category filters
# ============================================================

def test_get_events_with_category_filter():
    setup_database()

    response = client.get(
        "/events/",
        params={
            "category": "Technology",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 3

    titles = [
        event["title"]
        for event in data
    ]

    assert "AI Conference 2026" in titles
    assert "Web Development Workshop" in titles
    assert "Sold Out Technology Event" in titles

    teardown_database()


def test_get_events_with_multiple_categories():
    setup_database()

    response = client.get(
        "/events/",
        params=[
            ("category", "Technology"),
            ("category", "Business"),
        ],
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 4

    titles = [
        event["title"]
        for event in data
    ]

    assert "AI Conference 2026" in titles
    assert "Web Development Workshop" in titles
    assert "Business Leadership Seminar" in titles
    assert "Sold Out Technology Event" in titles

    teardown_database()


# ============================================================
# Location filter
# ============================================================

def test_get_events_with_location_filter():
    setup_database()

    response = client.get(
        "/events/",
        params={
            "location": "Nicosia",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2

    titles = [
        event["title"]
        for event in data
    ]

    assert "AI Conference 2026" in titles
    assert "Sold Out Technology Event" in titles

    teardown_database()


# ============================================================
# Search filter
# ============================================================

def test_get_events_with_search():
    setup_database()

    response = client.get(
        "/events/",
        params={
            "search": "AI Conference",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["title"] == "AI Conference 2026"

    teardown_database()


def test_get_events_with_location_search():
    setup_database()

    response = client.get(
        "/events/",
        params={
            "search": "Limassol",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["title"] == "Web Development Workshop"
    assert data[0]["location"] == "Limassol"

    teardown_database()


def test_get_events_with_no_matching_search():
    setup_database()

    response = client.get(
        "/events/",
        params={
            "search": "Python",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data == []

    teardown_database()


# ============================================================
# Timeframe filter
# ============================================================

def test_get_events_with_next_month_filter():
    setup_database()

    with patch("app.crud.event.date") as mock_date:
        mock_date.today.return_value = date(2026, 9, 25)

        response = client.get(
            "/events/",
            params={
                "timeframe": "next_month",
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2

    titles = [
        event["title"]
        for event in data
    ]

    # October events should be included
    assert "AI Conference 2026" in titles
    assert "Sold Out Technology Event" in titles

    # November event should be excluded
    assert "Web Development Workshop" not in titles

    # December event should also be excluded
    assert "Business Leadership Seminar" not in titles

    teardown_database()


# ============================================================
# Availability filter
# ============================================================

def test_get_events_hide_sold_out():
    setup_database()

    response = client.get(
        "/events/",
        params={
            "hide_sold_out": True,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 3

    titles = [
        event["title"]
        for event in data
    ]

    assert "Sold Out Technology Event" not in titles
    assert "AI Conference 2026" in titles
    assert "Web Development Workshop" in titles
    assert "Business Leadership Seminar" in titles

    teardown_database()


# ============================================================
# Combined filters
# ============================================================

def test_get_events_with_combined_filters():
    setup_database()

    response = client.get(
        "/events/",
        params=[
            ("search", "AI"),
            ("category", "Technology"),
            ("category", "Business"),
            ("location", "Nicosia"),
            ("timeframe", "next_3_months"),
            ("hide_sold_out", "true"),
        ],
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1

    assert data[0]["title"] == "AI Conference 2026"
    assert data[0]["location"] == "Nicosia"
    assert data[0]["available_seats"] > 0

    teardown_database()