import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Home/Footer";

import api from "../services/api";

export default function MyEvents() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please sign in to view your registrations.");
                    return;
                }

                const response = await api.get("/registrations/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const registrationData = response.data;

                const registrationsWithEvents = await Promise.all(
                    registrationData.map(async (registration) => {
                        const eventResponse = await api.get(
                            `/events/${registration.event_id}`
                        );

                        return {
                            ...registration,
                            event: eventResponse.data,
                        };
                    })
                );

                setRegistrations(registrationsWithEvents);

            } catch (error) {
                console.error("Failed to fetch registrations:", error);

                setError(
                    error.response?.data?.detail ||
                    "Failed to load your registrations."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    const handleCancel = async (eventId, registrationId) => {
        const confirmed = window.confirm(
        "Are you sure you want to cancel this registration?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancellingId(registrationId);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please sign in to cancel your registration.");
                return;
            }

            await api.put(
                `/registrations/${eventId}`,
                {
                    status: "cancelled",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setRegistrations((currentRegistrations) =>
                currentRegistrations.map((registration) =>
                    registration.id === registrationId
                        ? {
                            ...registration,
                            status: "cancelled",
                        }
                        : registration
                )
            );

        } catch (error) {
            console.error(
                "Failed to cancel registration:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to cancel registration."
            );

        } finally {
            setCancellingId(null);
        }
    };

    const today = new Date();

    const upcomingEvents = registrations.filter((registration) => {
        if (registration.status !== "registered") {
            return false;
        }

        return new Date(registration.event.event_date) >= today;
    });


    const pastEvents = registrations.filter((registration) => {
        if (registration.status === "cancelled") {
            return false;
        }

        if (registration.status === "attended") {
            return true;
        }

        return new Date(registration.event.event_date) < today;
    });

    const cancelledEvents = registrations.filter(
        (registration) => registration.status === "cancelled"
    );

    if (loading) {
        return (
            <>
                <Navbar
                    showSearch={false}
                    showJoin={false}
                    showProfile={true}
                    navbarClassName="registration-navbar"
                />

                <main className="my-events-page">
                    <div className="container-fluid py-5 text-center">
                        <p>Loading your registrations...</p>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar
                    showSearch={false}
                    showJoin={false}
                    showProfile={true}
                    navbarClassName="registration-navbar"
                />

                <main className="my-events-page">
                    <div className="container-fluid py-5 text-center">
                        <p className="text-danger">{error}</p>
                    </div>
                </main>

                <Footer />
            </>
        );
    }


    return(
        <>

            <Navbar
                showSearch={false}
                showJoin={false}
                showProfile={true}
                navbarClassName="registration-navbar"
            />

            <main className="my-events-page">
                <div className="container-fluid">
                    {/* page header */}
                    <section className="my-events-header">
                        <h1>My Registrations</h1>
                        <p> Manage your upcoming event attendance and review past experiences in one place.</p>

                    </section>

                    {/* summary cards */}
                    <section className="registration-summary">
                        <div className="registration-summary-card">
                            <div className="summary-icon">
                                <i className="bi bi-ticket-perforated"></i>
                            </div>

                            <div>
                                <span>Active Bookings</span>
                                <strong>{upcomingEvents.length}</strong>

                            </div>

                        </div>

                        <div className="registration-summary-card">
                            <div className="summary-icon past-icon">
                                <i className="bi bi-clock-history"></i>
                            </div>

                            <div>
                                <span>Past Events</span>
                                <strong>{pastEvents.length}</strong>
                            </div>
                        </div>

                        <div className="registration-summary-card">
                            <div className="summary-icon next-icon">
                                <i className="bi bi-calendar-event"></i>
                            </div>

                            <div>
                                <span>Next Event</span>
                                <strong>
                                    {upcomingEvents.length > 0 ? upcomingEvents[0].event.event_date
                                        : "No upcoming events"
                                    }
                                </strong>

                            </div>

                        </div>

                    </section>

                    {/* upcoming events */}
                    <section className="registration-section">
                        <div className="registration-section-header">
                            <h2>Upcoming Events</h2>
                            <span>{upcomingEvents.length} events</span>

                        </div>

                        <div className="registration-table-wrapper">
                            <div className="registration-table">
                                <div className="registration-table-header">
                                    <span>EVENT NAME</span>
                                    <span>DATE</span>
                                    <span>STATUS</span>
                                    <span>ACTIONS</span>
                                </div>

                                {upcomingEvents.map((registration) => (
                                    <div
                                        className="registration-table-row"
                                        key={registration.id}
                                    >
                                        <div className="registration-event">
                                            <img src={registration.event.image || "https://via.placeholder.com/80x60?text=Event"} 
                                                alt={registration.event.title} 
                                            />
                                            <strong>{registration.event.title}</strong>

                                        </div>

                                        <span className="registration-date"> {registration.event.event_date} </span>

                                        <span>
                                            <span className="registration-status upcoming">
                                                Upcoming
                                            </span>

                                        </span>

                                        <div className="registration-actions">
                                            <button className="cancel-registration"
                                                onClick={() => handleCancel( registration.event_id, registration.id )}
                                                disabled={cancellingId === registration.id}
                                            > 
                                                {cancellingId === registration.id ? "Cancelling..." : "Cancel"}
                                            </button>

                                        </div>

                                    </div>
                                ))}

                            </div>

                        </div>

                    </section>

                    {/* past events */}
                    <section className="registration-section past-events-section">
                        <div className="registration-section-header">
                            <h2>Past Events</h2>
                            <span>{pastEvents.length} events</span>

                        </div>

                        <div className="registration-table-wrapper">
                            <div className="registration-table">
                                <div className="registration-table-header">
                                    <span>EVENT NAME</span>
                                    <span>DATE</span>
                                    <span>STATUS</span>
                                    <span>ACTIONS</span>
                                </div>

                                {pastEvents.map((registration) => (
                                    <div  className="registration-table-row" key={registration.id}>
                                        <div className="registration-event">
                                            <img src={registration.event.image || "https://via.placeholder.com/80x60?text=Event"} 
                                                alt={registration.event.title} 
                                            />
                                            <strong>{registration.event.title}</strong>

                                        </div>

                                        <span className="registration-date"> {registration.event.event_date} </span>

                                        <span>
                                            <span className="registration-status past"> 
                                                {registration.status === "attended" ? "Attended"  : "Past"}
                                             </span>
                                        </span>

                                        <div className="registration-actions">
                                            <button className="details-registration"> Details </button>
                                        </div>

                                    </div>
                                ))}

                            </div>

                        </div>

                    </section>

                    <section className="registration-section cancelled-events-section">
                        <div className="registration-section-header">
                            <h2>Cancelled Events</h2>
                            <span>{cancelledEvents.length} events</span>
                        </div>

                        <div className="registration-table-wrapper">
                            <div className="registration-table">

                                <div className="registration-table-header">
                                    <span>EVENT NAME</span>
                                    <span>DATE</span>
                                    <span>STATUS</span>
                                    <span>ACTIONS</span>
                                </div>

                                {cancelledEvents.map((registration) => (
                                    <div
                                        className="registration-table-row"
                                        key={registration.id}
                                    >
                                        <div className="registration-event">
                                            <img
                                                src={
                                                    registration.event.image ||
                                                    "https://via.placeholder.com/80x60?text=Event"
                                                }
                                                alt={registration.event.title}
                                            />

                                            <strong>
                                                {registration.event.title}
                                            </strong>
                                        </div>

                                        <span className="registration-date">
                                            {registration.event.event_date}
                                        </span>

                                        <span>
                                            <span className="registration-status cancelled">
                                                Cancelled
                                            </span>
                                        </span>

                                        <div className="registration-actions">
                                            <button className="details-registration">
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </section>

                </div>

            </main>
        
            <Footer />

        </>
    );
}