import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deletingId, setDeletingId] = useState(null);

    const [editingEvent, setEditingEvent] = useState(null);
    const [saving, setSaving] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const emptyEvent = {
        organizer_id: "",
        category_id: "",
        title: "",
        description: "",
        image: "",
        event_date: "",
        start_time: "",
        end_time: "",
        max_capacity: 1,
        location: "",
        latitude: "",
        longitude: "",
        status: "draft",
    };

    const [newEvent, setNewEvent] = useState(emptyEvent);
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        try {
            setCreating(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/admin/events",
                {
                    ...newEvent,
                    organizer_id: Number(
                        newEvent.organizer_id
                    ),
                    category_id: Number(
                        newEvent.category_id
                    ),
                    max_capacity: Number(
                        newEvent.max_capacity
                    ),
                    latitude:
                        newEvent.latitude === ""
                            ? null
                            : Number(newEvent.latitude),
                    longitude:
                        newEvent.longitude === ""
                            ? null
                            : Number(newEvent.longitude),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEvents((currentEvents) => [
                ...currentEvents,
                response.data,
            ]);

            setNewEvent(emptyEvent);
            setShowCreateModal(false);

        } catch (error) {
            console.error(
                "Failed to create event:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to create event."
            );

        } finally {
            setCreating(false);
        }
    };

    const handleEdit = (event) => {
        setEditingEvent({
            ...event,
        });
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.put(
                `/admin/events/${editingEvent.id}`,
                {
                    title: editingEvent.title,
                    description: editingEvent.description,
                    location: editingEvent.location,
                    max_capacity: editingEvent.max_capacity,
                    latitude: editingEvent.latitude,
                    longitude: editingEvent.longitude,
                    status: editingEvent.status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEvents((currentEvents) =>
                currentEvents.map((event) =>
                    event.id === editingEvent.id
                        ? response.data
                        : event
                )
            );

            setEditingEvent(null);

        } catch (error) {
            console.error(
                "Failed to update event:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to update event."
            );

        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(eventId);
            setError("");

            const token = localStorage.getItem("token");

            await api.delete(
                `/admin/events/${eventId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEvents((currentEvents) =>
                currentEvents.filter(
                    (event) => event.id !== eventId
                )
            );

        } catch (error) {
            console.error(
                "Failed to delete event:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to delete event."
            );

        } finally {
            setDeletingId(null);
        }
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/admin/events", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEvents(response.data);
        } catch (error) {
            console.error("Failed to load events:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to load events."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const totalSeats = events.reduce(
        (total, event) => total + (event.max_capacity || 0),
        0
    );

    return (
        <div className="admin-events">

            <div className="admin-page-header">
                <div>
                    <h2>Event Management</h2>
                    <p>
                        Manage and monitor all events in the system.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Event
                </button>
            </div>

            <div className="admin-stats-grid">

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <i className="bi bi-calendar-event"></i>
                    </div>

                    <div>
                        <span className="admin-stat-label">
                            Total Events
                        </span>

                        <h3>
                            {events.length}
                        </h3>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <i className="bi bi-grid-3x3-gap"></i>
                    </div>

                    <div>
                        <span className="admin-stat-label">
                            Total Seats
                        </span>

                        <h3>
                            {totalSeats}
                        </h3>
                    </div>
                </div>

            </div>

            <div className="admin-dashboard-card">

                <div className="admin-card-header">
                    <div>
                        <h4>Events</h4>
                        <p>
                            View and manage your event records.
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="admin-loading-state">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p>
                            Loading events...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="admin-error-state">
                        <i className="bi bi-exclamation-triangle"></i>

                        <h5>
                            Unable to load events
                        </h5>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={fetchEvents}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && events.length === 0 && (
                    <div className="admin-empty-state">
                        <i className="bi bi-calendar-x"></i>

                        <h5>
                            No events found
                        </h5>

                        <p>
                            There are currently no events in the system.
                        </p>
                    </div>
                )}

                {!loading && !error && events.length > 0 && (
                    <div className="admin-table-wrapper">
                        <table className="table admin-table">

                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Seats</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {events.map((event) => (
                                    <tr key={event.id}>

                                        <td>
                                            <div className="admin-event-info">
                                                <strong>
                                                    {event.title}
                                                </strong>

                                                <small>
                                                    {event.location}
                                                </small>
                                            </div>
                                        </td>

                                        <td>
                                            {event.category?.name || "—"}
                                        </td>

                                        <td>
                                            {event.event_date}
                                        </td>

                                        <td>
                                            {event.available_seats}
                                            {" / "}
                                            {event.max_capacity}
                                        </td>

                                        <td>
                                            <span
                                                className={`admin-status-badge ${getStatusClass(
                                                    event.status
                                                )}`}
                                            >
                                                {event.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="admin-action-buttons">

                                                <button
                                                    type="button"
                                                    className="admin-action-button"
                                                    title="View event"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-action-button"
                                                    title="Edit event"
                                                    onClick={() => handleEdit(event)}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-action-button admin-action-danger"
                                                    title="Delete event"
                                                    onClick={() => handleDelete(event.id)} disabled={deletingId === event.id}
                                                >
                                                    <i className={deletingId === event.id  ? "bi bi-hourglass-split" : "bi bi-trash"}></i>
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>

                        {editingEvent && (
                            <div className="admin-modal-backdrop">
                                <div className="admin-modal">

                                    <div className="admin-modal-header">
                                        <div>
                                            <h4>Edit Event</h4>
                                            <p>
                                                Update the event information.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="admin-modal-close"
                                            onClick={() => setEditingEvent(null)}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>

                                    <div className="admin-modal-body">

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Event Title
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingEvent.title}
                                                onChange={(e) =>
                                                    setEditingEvent({
                                                        ...editingEvent,
                                                        title: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Description
                                            </label>

                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={editingEvent.description || ""}
                                                onChange={(e) =>
                                                    setEditingEvent({
                                                        ...editingEvent,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="row">

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    Location
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editingEvent.location}
                                                    onChange={(e) =>
                                                        setEditingEvent({
                                                            ...editingEvent,
                                                            location: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    Maximum Capacity
                                                </label>

                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    min="1"
                                                    value={editingEvent.max_capacity}
                                                    onChange={(e) =>
                                                        setEditingEvent({
                                                            ...editingEvent,
                                                            max_capacity: Number(
                                                                e.target.value
                                                            ),
                                                        })
                                                    }
                                                />
                                            </div>

                                        </div>

                                        <div className="row">

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    Latitude
                                                </label>

                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-control"
                                                    value={editingEvent.latitude ?? ""}
                                                    onChange={(e) =>
                                                        setEditingEvent({
                                                            ...editingEvent,
                                                            latitude:
                                                                e.target.value === ""
                                                                    ? null
                                                                    : Number(e.target.value),
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    Longitude
                                                </label>

                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-control"
                                                    value={editingEvent.longitude ?? ""}
                                                    onChange={(e) =>
                                                        setEditingEvent({
                                                            ...editingEvent,
                                                            longitude:
                                                                e.target.value === ""
                                                                    ? null
                                                                    : Number(e.target.value),
                                                        })
                                                    }
                                                />
                                            </div>

                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Status
                                            </label>

                                            <select
                                                className="form-select"
                                                value={editingEvent.status}
                                                onChange={(e) =>
                                                    setEditingEvent({
                                                        ...editingEvent,
                                                        status: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="draft">
                                                    Draft
                                                </option>

                                                <option value="published">
                                                    Published
                                                </option>

                                                <option value="cancelled">
                                                    Cancelled
                                                </option>
                                            </select>
                                        </div>

                                    </div>

                                    <div className="admin-modal-footer">

                                        <button
                                            type="button"
                                            className="btn btn-light"
                                            onClick={() =>
                                                setEditingEvent(null)
                                            }
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleUpdate}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                    ></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-lg me-2"></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>

                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                )}

                {showCreateModal && (
                    <div className="admin-modal-backdrop">
                        <div className="admin-modal">

                            <div className="admin-modal-header">
                                <div>
                                    <h4>Create Event</h4>
                                    <p>
                                        Add a new event to the system.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="admin-modal-close"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            <div className="admin-modal-body">

                                <div className="mb-3">
                                    <label className="form-label">
                                        Event Title
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newEvent.title}
                                        onChange={(e) =>
                                            setNewEvent({
                                                ...newEvent,
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={newEvent.description}
                                        onChange={(e) =>
                                            setNewEvent({
                                                ...newEvent,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Organizer ID
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control"
                                            value={newEvent.organizer_id}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    organizer_id: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Category ID
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control"
                                            value={newEvent.category_id}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    category_id: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                        />
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Event Date
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            value={newEvent.event_date}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    event_date: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">
                                            Start
                                        </label>

                                        <input
                                            type="time"
                                            className="form-control"
                                            value={newEvent.start_time}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    start_time: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">
                                            End
                                        </label>

                                        <input
                                            type="time"
                                            className="form-control"
                                            value={newEvent.end_time}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    end_time: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Location
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newEvent.location}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    location: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Maximum Capacity
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control"
                                            value={newEvent.max_capacity}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    max_capacity: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                        />
                                    </div>

                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Image URL
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newEvent.image}
                                        onChange={(e) =>
                                            setNewEvent({
                                                ...newEvent,
                                                image: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Latitude
                                        </label>

                                        <input
                                            type="number"
                                            step="any"
                                            className="form-control"
                                            value={newEvent.latitude}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    latitude:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Longitude
                                        </label>

                                        <input
                                            type="number"
                                            step="any"
                                            className="form-control"
                                            value={newEvent.longitude}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    longitude:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Status
                                    </label>

                                    <select
                                        className="form-select"
                                        value={newEvent.status}
                                        onChange={(e) =>
                                            setNewEvent({
                                                ...newEvent,
                                                status: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="draft">
                                            Draft
                                        </option>

                                        <option value="published">
                                            Published
                                        </option>

                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                </div>

                            </div>

                            <div className="admin-modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={() =>
                                        setShowCreateModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleCreate}
                                    disabled={creating}
                                >
                                    {creating ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            ></span>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-plus-lg me-2"></i>
                                            Create Event
                                        </>
                                    )}
                                </button>

                            </div>

                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}

function getStatusClass(status) {
    switch (status) {
        case "published":
            return "published";

        case "draft":
            return "draft";

        case "cancelled":
            return "cancelled";

        default:
            return "";
    }
}