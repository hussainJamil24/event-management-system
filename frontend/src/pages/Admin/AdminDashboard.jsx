import { useEffect, useState } from "react";
import api from "../../services/api";


export default function AdminDashboard() {

    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchDashboardStatistics = async () => {

            try {

                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await api.get(
                    "/admin/dashboard/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setStatistics(response.data);

            } catch (error) {

                console.error(
                    "Failed to load dashboard statistics:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Failed to load dashboard statistics."
                );

            } finally {

                setLoading(false);

            }
        };


        fetchDashboardStatistics();

    }, []);


    const chartData = statistics?.events_by_category || [];


    const totalCategoryEvents = chartData.reduce(
        (total, item) => total + item.count,
        0
    );


    if (loading) {
        return (
            <div className="admin-dashboard">

                <div className="admin-page-header">
                    <h2>System Overview</h2>
                    <p>
                        Real-time performance metrics and insights.
                    </p>
                </div>

                <div className="admin-loading-state">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p>Loading dashboard...</p>

                </div>

            </div>
        );
    }


    if (error) {
        return (
            <div className="admin-dashboard">

                <div className="admin-page-header">
                    <h2>System Overview</h2>
                    <p>
                        Real-time performance metrics and insights.
                    </p>
                </div>

                <div className="admin-error-state">
                    <i className="bi bi-exclamation-triangle"></i>

                    <h5>Unable to load dashboard</h5>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Try Again
                    </button>
                </div>

            </div>
        );
    }


    return (
        <div className="admin-dashboard">

            {/* Page header */}

            <div className="admin-page-header">

                <h2>System Overview</h2>

                <p>
                    Real-time performance metrics and insights.
                </p>

            </div>


            {/* Statistics */}

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
                            {statistics.total_events}
                        </h3>

                    </div>

                </div>


                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="bi bi-people"></i>
                    </div>

                    <div>

                        <span className="admin-stat-label">
                            Total Users
                        </span>

                        <h3>
                            {statistics.total_users}
                        </h3>

                    </div>

                </div>


                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="bi bi-person-check"></i>
                    </div>

                    <div>

                        <span className="admin-stat-label">
                            Registrations
                        </span>

                        <h3>
                            {statistics.total_registrations}
                        </h3>

                    </div>

                </div>


                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="bi bi-grid"></i>
                    </div>

                    <div>

                        <span className="admin-stat-label">
                            Categories
                        </span>

                        <h3>
                            {statistics.total_categories}
                        </h3>

                    </div>

                </div>

            </div>


            {/* Dashboard cards */}

            <div className="admin-dashboard-grid">


                {/* Events by Category */}

                <div className="admin-dashboard-card">

                    <div className="admin-card-header">

                        <div>

                            <h4>
                                Events by Category
                            </h4>

                            <p>
                                Distribution of events across categories.
                            </p>

                        </div>

                    </div>


                    <div className="admin-category-chart">

                        {chartData.length === 0 ? (

                            <div className="admin-empty-chart">
                                No events available.
                            </div>

                        ) : (

                            <>

                                <div
                                    className="admin-donut"
                                    style={{
                                        background: createDonutGradient(
                                            chartData
                                        ),
                                    }}
                                >

                                    <div className="admin-donut-center">

                                        <strong>
                                            {totalCategoryEvents}
                                        </strong>

                                        <span>
                                            Events
                                        </span>

                                    </div>

                                </div>


                                <div className="admin-chart-legend">

                                    {chartData.map(
                                        (item, index) => {

                                            const percentage =
                                                totalCategoryEvents === 0
                                                    ? 0
                                                    : Math.round(
                                                        (item.count /
                                                            totalCategoryEvents) *
                                                        100
                                                    );

                                            return (
                                                <div
                                                    className="admin-legend-item"
                                                    key={item.category}
                                                >

                                                    <span
                                                        className="admin-legend-dot"
                                                        style={{
                                                            backgroundColor:
                                                                getChartColor(index),
                                                        }}
                                                    ></span>

                                                    <span className="admin-legend-name">
                                                        {item.category}
                                                    </span>

                                                    <strong>
                                                        {item.count}
                                                    </strong>

                                                    <small>
                                                        {percentage}%
                                                    </small>

                                                </div>
                                            );

                                        }
                                    )}

                                </div>

                            </>

                        )}

                    </div>

                </div>


                {/* Recent Activity */}

                <div className="admin-dashboard-card">

                    <div className="admin-card-header">

                        <div>

                            <h4>
                                Recent Activity
                            </h4>

                            <p>
                                Latest system activity.
                            </p>

                        </div>

                    </div>


                    <div className="admin-activity-placeholder">

                        No recent activity.

                    </div>

                </div>


            </div>

        </div>
    );
}


function getChartColor(index) {

    const colors = [
        "#0f766e",
        "#2563eb",
        "#7c3aed",
        "#ea580c",
        "#db2777",
        "#0891b2",
    ];

    return colors[index % colors.length];
}


function createDonutGradient(data) {

    const total = data.reduce(
        (sum, item) => sum + item.count,
        0
    );

    if (total === 0) {
        return "#e5e7eb";
    }


    let currentPercentage = 0;

    const segments = data.map((item, index) => {

        const percentage =
            (item.count / total) * 100;

        const start = currentPercentage;

        const end =
            currentPercentage + percentage;

        currentPercentage = end;

        return `${getChartColor(index)} ${start}% ${end}%`;

    });


    return `conic-gradient(${segments.join(", ")})`;
}