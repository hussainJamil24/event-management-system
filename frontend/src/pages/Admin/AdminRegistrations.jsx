import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminRegistrations() {
    const { token } = useAuth();

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState("");

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    "/admin/registrations",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRegistrations(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.detail ||
                        "Failed to load registrations."
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchRegistrations();
        }

    }, [token]);

    const handleStatusClick = (registration) => {
        setSelectedRegistration(registration);
        setNewStatus(registration.status);
        setUpdateError("");
        setShowStatusModal(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedRegistration) {
            return;
        }

        try {
            setUpdating(true);
            setUpdateError("");

            const response = await api.put(
                `/admin/registrations/${selectedRegistration.id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setRegistrations((previousRegistrations) =>
                previousRegistrations.map((registration) =>
                    registration.id === selectedRegistration.id
                        ? response.data
                        : registration
                )
            );

            setShowStatusModal(false);
            setSelectedRegistration(null);
            setNewStatus("");

        } catch (error) {
            setUpdateError(
                error.response?.data?.detail ||
                    "Failed to update registration status."
            );

        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div
                    className="spinner-border"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2>Registrations</h2>

                <p className="text-muted">
                    Manage event registrations.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User ID</th>
                                    <th>Event ID</th>
                                    <th>Status</th>
                                    <th>Registration Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {registrations.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                        >
                                            No registrations found.
                                        </td>
                                    </tr>
                                ) : (
                                    registrations.map(
                                        (registration) => (
                                            <tr
                                                key={
                                                    registration.id
                                                }
                                            >
                                                <td>
                                                    {
                                                        registration.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        registration.user_id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        registration.event_id
                                                    }
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            registration.status ===
                                                            "registered"
                                                                ? "bg-success"
                                                                : registration.status ===
                                                                  "cancelled"
                                                                ? "bg-secondary"
                                                                : "bg-primary"
                                                        }`}
                                                    >
                                                        {
                                                            registration.status
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {new Date(
                                                        registration.registration_date
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleStatusClick(registration)}
                                                    >
                                                        Change Status
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {showStatusModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Change Registration Status
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setSelectedRegistration(null);
                                        setUpdateError("");
                                    }}
                                    disabled={updating}
                                ></button>
                            </div>

                            <div className="modal-body">

                                {updateError && (
                                    <div className="alert alert-danger">
                                        {updateError}
                                    </div>
                                )}

                                {selectedRegistration && (
                                    <>
                                        <p>
                                            Registration ID:{" "}
                                            <strong>
                                                {selectedRegistration.id}
                                            </strong>
                                        </p>

                                        <p>
                                            User ID:{" "}
                                            <strong>
                                                {selectedRegistration.user_id}
                                            </strong>
                                        </p>

                                        <p>
                                            Event ID:{" "}
                                            <strong>
                                                {selectedRegistration.event_id}
                                            </strong>
                                        </p>

                                        <div className="mb-3">
                                            <label
                                                htmlFor="registration-status"
                                                className="form-label"
                                            >
                                                Status
                                            </label>

                                            <select
                                                id="registration-status"
                                                className="form-select"
                                                value={newStatus}
                                                onChange={(event) =>
                                                    setNewStatus(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={updating}
                                            >
                                                <option value="registered">
                                                    Registered
                                                </option>

                                                <option value="cancelled">
                                                    Cancelled
                                                </option>

                                                <option value="attended">
                                                    Attended
                                                </option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setSelectedRegistration(null);
                                        setUpdateError("");
                                    }}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdateStatus}
                                    disabled={ updating || !selectedRegistration || 
                                        newStatus === selectedRegistration.status
                                    }
                                >
                                    {updating ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            ></span>
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Status"
                                    )}
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}