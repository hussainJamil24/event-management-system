from datetime import date, time
from app.models.category import Category

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.core.database import Base, get_db
from app.main import app
from app.models.event import Event


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
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

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

    db.add_all([event_1, event_2, event_3])
    db.commit()
    db.close()


def teardown_database():
    Base.metadata.drop_all(bind=engine)


def test_get_all_events_without_search():
    setup_database()

    response = client.get("/events/")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 3
    assert data[0]["title"] == "AI Conference 2026"
    assert data[1]["title"] == "Web Development Workshop"
    assert data[2]["title"] == "Business Leadership Seminar"

    teardown_database()


def test_get_events_with_category_filter():
    setup_database()

    response = client.get(
        "/events/",
        params={"category": "Technology"},
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2
    assert data[0]["title"] == "AI Conference 2026"
    assert data[1]["title"] == "Web Development Workshop"

    teardown_database()


def test_get_events_with_location_filter():
    setup_database()

    response = client.get(
        "/events/",
        params={"location": "Nicosia"},
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["title"] == "AI Conference 2026"
    assert data[0]["location"] == "Nicosia"

    teardown_database()


def test_get_events_with_combined_filters():
    setup_database()

    response = client.get(
        "/events/",
        params={
            "search": "AI",
            "category": "Technology",
            "location": "Nicosia",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["title"] == "AI Conference 2026"
    assert data[0]["location"] == "Nicosia"

    teardown_database()


def test_get_events_with_search():
    setup_database()

    response = client.get(
        "/events/",
        params={"search": "AI"},
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
        params={"search": "Limassol"},
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
        params={"search": "Python"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data == []

    teardown_database()