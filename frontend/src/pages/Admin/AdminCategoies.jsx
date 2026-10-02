import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
    });

    const [editingCategory, setEditingCategory] = useState(null);
    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    const handleCreateChange = (e) => {
        const { name, value } = e.target;

        setNewCategory((previousCategory) => ({
            ...previousCategory,
            [name]: value,
        }));
    };

    const handleCreate = async () => {
        if (!newCategory.name.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setCreating(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/admin/categories",
                {
                    name: newCategory.name.trim(),
                    description:
                        newCategory.description.trim() || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCategories((currentCategories) => [
                ...currentCategories,
                response.data,
            ]);

            setNewCategory({
                name: "",
                description: "",
            });

            setShowCreateModal(false);
        } catch (error) {
            console.error(
                "Failed to create category:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to create category."
            );
        } finally {
            setCreating(false);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditingCategory((previousCategory) => ({
            ...previousCategory,
            [name]: value,
        }));
    };

    const handleEdit = (category) => {
        setError("");

        setEditingCategory({
            id: category.id,
            name: category.name,
            description: category.description || "",
        });
    };

    const handleUpdate = async () => {
        if (!editingCategory.name.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.put(
                `/admin/categories/${editingCategory.id}`,
                {
                    name: editingCategory.name.trim(),
                    description:
                        editingCategory.description.trim() || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCategories((currentCategories) =>
                currentCategories.map((category) =>
                    category.id === editingCategory.id
                        ? response.data
                        : category
                )
            );

            setEditingCategory(null);
        } catch (error) {
            console.error(
                "Failed to update category:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to update category."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (categoryId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(categoryId);
            setError("");

            const token = localStorage.getItem("token");

            await api.delete(
                `/admin/categories/${categoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCategories((currentCategories) =>
                currentCategories.filter(
                    (category) => category.id !== categoryId
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete category:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to delete category."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/categories",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCategories(response.data);
        } catch (error) {
            console.error(
                "Failed to load categories:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Categories</h2>
                    <p className="text-muted mb-0">
                        Manage event categories
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {setError("");
                        setShowCreateModal(true);
                    }}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Category
                </button>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <div
                        className="spinner-border"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-2 text-muted">
                        Loading categories...
                    </p>
                </div>
            ) : (
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Category Name</th>
                                        <th>Description</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center py-4 text-muted"
                                            >
                                                No categories found.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map(
                                            (category) => (
                                                <tr
                                                    key={
                                                        category.id
                                                    }
                                                >
                                                    <td>
                                                        {
                                                            category.id
                                                        }
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {
                                                                category.name
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            category.description ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {new Date(
                                                            category.created_at
                                                        ).toLocaleDateString()}
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                            onClick={() => handleEdit(category)}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(category.id)}
                                                            disabled={deletingId === category.id}
                                                        >
                                                            {deletingId === category.id ? (
                                                                <span
                                                                    className="spinner-border spinner-border-sm"
                                                                    role="status"
                                                                ></span>
                                                            ) : (
                                                                <i className="bi bi-trash"></i>
                                                             )}
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
            )}

            {showCreateModal && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Add Category
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setShowCreateModal(false)
                                    }
                                    disabled={creating}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label
                                        htmlFor="category-name"
                                        className="form-label"
                                    >
                                        Category Name
                                    </label>

                                    <input
                                        id="category-name"
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={newCategory.name}
                                        onChange={handleCreateChange}
                                        placeholder="Enter category name"
                                        maxLength="100"
                                        disabled={creating}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="category-description"
                                        className="form-label"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="category-description"
                                        name="description"
                                        className="form-control"
                                        rows="4"
                                        value={newCategory.description}
                                        onChange={handleCreateChange}
                                        placeholder="Enter category description"
                                        maxLength="500"
                                        disabled={creating}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowCreateModal(false)
                                    }
                                    disabled={creating}
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
                                                role="status"
                                            ></span>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-plus-lg me-2"></i>
                                            Create Category
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editingCategory && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Edit Category
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setEditingCategory(null)
                                    }
                                    disabled={saving}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label
                                        htmlFor="edit-category-name"
                                        className="form-label"
                                    >
                                        Category Name
                                    </label>

                                    <input
                                        id="edit-category-name"
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={editingCategory.name}
                                        onChange={handleEditChange}
                                        placeholder="Enter category name"
                                        maxLength="100"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="edit-category-description"
                                        className="form-label"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="edit-category-description"
                                        name="description"
                                        className="form-control"
                                        rows="4"
                                        value={
                                            editingCategory.description
                                        }
                                        onChange={handleEditChange}
                                        placeholder="Enter category description"
                                        maxLength="500"
                                        disabled={saving}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setEditingCategory(null)
                                    }
                                    disabled={saving}
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
                                                role="status"
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
                </div>
            )}
        </div>
    );
}