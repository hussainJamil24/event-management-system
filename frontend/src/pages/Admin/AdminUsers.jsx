import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
   const { user: currentUser, token } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [editForm, setEditForm] = useState({
        first_name: "",
        last_name: "",
        profile_image: "",
    });

    const [editError, setEditError] = useState("");
    const [savingUser, setSavingUser] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);
    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users", {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            setUsers(response.data);
            } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Failed to load users."
            );
            } finally {
            setLoading(false);
            }
        };

        if (token) {
            fetchUsers();
        }
    }, [token]);

    if (loading) {
        return (
        <div className="text-center py-5">
            <div className="spinner-border" role="status">
            <span className="visually-hidden">
                Loading...
            </span>
            </div>
        </div>
        );
    }

    const handleEditClick = (user) => {
        setEditingUser(user);

        setEditForm({
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image: user.profile_image || "",
        });

        setEditError("");
        setShowEditModal(true);
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
            setEditForm((previous) => ({
                ...previous,
                [name]: value,
        }));
    };

    const handleUpdateUser = async (event) => {
        event.preventDefault();

        if (!editingUser) {
            return;
        }

        try {
            setSavingUser(true);
            setEditError("");

            const response = await api.put(
            `/admin/users/${editingUser.id}`,
            editForm,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            setUsers((previousUsers) =>
            previousUsers.map((user) =>
                user.id === editingUser.id
                ? response.data
                : user
            )
            );

            setShowEditModal(false);
            setEditingUser(null);

        } catch (error) {
            setEditError(
            error.response?.data?.detail ||
                "Failed to update user."
            );

        } finally {
            setSavingUser(false);
        }
    };

    const handleDeleteClick = (user) => {
        if (currentUser?.id === user.id) {
            return;
        }

        setDeletingUser(user);
        setDeleteError("");
        setShowDeleteModal(true);
    };

    const handleDeleteUser = async () => {
        if (!deletingUser) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError("");

            await api.delete(
                `/admin/users/${deletingUser.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (user) => user.id !== deletingUser.id
                )
            );

            setShowDeleteModal(false);
            setDeletingUser(null);

        } catch (error) {
            setDeleteError(
                error.response?.data?.detail ||
                    "Failed to delete user."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div className="mb-4">
                <h2>Users</h2>
                <p className="text-muted">
                Manage registered users.
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length === 0 ? (
                                <tr>
                                    <td
                                    colSpan="6"
                                    className="text-center py-4"
                                    >
                                    No users found.
                                    </td>
                                </tr>
                                ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                    <td>{user.id}</td>

                                    <td>
                                        {user.first_name} {user.last_name}
                                    </td>

                                    <td>{user.email}</td>

                                    <td>
                                        <span
                                        className={`badge ${
                                            user.role === "admin"
                                            ? "bg-danger"
                                            : "bg-secondary"
                                        }`}
                                        >
                                        {user.role}
                                        </span>
                                    </td>

                                    <td>
                                        {new Date(
                                        user.created_at
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>
                                        <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => handleEditClick(user)}
                                        >
                                        Edit
                                        </button>

                                        <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeleteClick(user)}
                                        disabled={currentUser?.id === user.id}
                                        >
                                        Delete
                                        </button>
                                    </td>
                                    </tr>
                                ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showEditModal && (
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                Edit User
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowEditModal(false)}
                                disabled={savingUser}
                            ></button>
                        </div>

                        <form onSubmit={handleUpdateUser}>

                            <div className="modal-body">

                                {editError && (
                                <div className="alert alert-danger">
                                    {editError}
                                </div>
                                )}

                                <div className="mb-3">
                                    <label
                                        htmlFor="first_name"
                                        className="form-label"
                                    >
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        name="first_name"
                                        value={editForm.first_name}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="last_name"
                                        className="form-label"
                                    >
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        name="last_name"
                                        value={editForm.last_name}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="profile_image"
                                        className="form-label"
                                    >
                                        Profile Image
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="profile_image"
                                        name="profile_image"
                                        value={editForm.profile_image}
                                        onChange={handleEditChange}
                                        placeholder="Image URL"
                                    />
                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowEditModal(false)}
                                disabled={savingUser}
                                >
                                Cancel
                                </button>

                                <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={savingUser}
                                >
                                {savingUser ? (
                                    <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    ></span>
                                    Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            </div>
            )}

            {showDeleteModal && (
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
                                    Delete User
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeletingUser(null);
                                        setDeleteError("");
                                    }}
                                    disabled={deleting}
                                ></button>
                            </div>

                            <div className="modal-body">

                                {deleteError && (
                                    <div className="alert alert-danger">
                                        {deleteError}
                                    </div>
                                )}

                                <p className="mb-2">
                                    Are you sure you want to delete this user?
                                </p>

                                {deletingUser && (
                                    <div className="bg-light rounded p-3">
                                        <strong>
                                            {deletingUser.first_name}{" "}
                                            {deletingUser.last_name}
                                        </strong>

                                        <div className="text-muted">
                                            {deletingUser.email}
                                        </div>
                                    </div>
                                )}

                                <p className="text-danger mt-3 mb-0">
                                    This action cannot be undone.
                                </p>

                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeletingUser(null);
                                        setDeleteError("");
                                    }}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDeleteUser}
                                    disabled={deleting}
                                >
                                    {deleting ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            ></span>

                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete User"
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