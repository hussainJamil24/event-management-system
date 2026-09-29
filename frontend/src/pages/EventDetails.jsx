import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import Navbar from "../components/Navbar";
import Footer from "../components/Home/Footer";

import api from "../services/api";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});



export default function EventDetails() {
    const { eventId } = useParams();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const fallbackCoordinates = [35.1856, 33.3823];

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/events/${eventId}`
                );

                setEvent(response.data);
            } catch (error) {
                console.error(
                    "Failed to fetch event:",
                    error
                );

                setError("Failed to load event.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    if (loading) {
        return (
            <>
                <Navbar
                    showSearch={false}
                    showJoin={false}
                    showProfile={true}
                    navbarClassName="eventdetails-navbar"
                />

                <div className="container py-5 text-center">
                    <p>Loading event...</p>
                </div>
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
                    navbarClassName="eventdetails-navbar"
                />

                <div className="container py-5 text-center">
                    <p className="text-danger">
                        {error}
                    </p>
                </div>
            </>
        );
    }

    if (!event) {
        return null;
    }

    const mapCoordinates =
        event.latitude != null && event.longitude != null
            ? [event.latitude, event.longitude]
            : fallbackCoordinates;

    return (
        <>
            <Navbar
                showSearch={false}
                showJoin={false}
                showProfile={true}
                navbarClassName="eventdetails-navbar"
            />

            <main className="event-details-page">

                <div className="container-fluid py-4">

                    <div className="row g-3">

                        {/* LEFT SIDE */}
                        <div className="col-12 col-lg-8">

                            <div className="event-details-main">

                                {/* Event image */}
                                <div className="event-details-image-container">

                                    <img
                                        src={
                                            event.image ||
                                            "https://via.placeholder.com/800x500?text=Event"
                                        }
                                        alt={event.title}
                                        className="event-details-image"
                                    />

                                    <span className="event-details-category">
                                        {event.category?.name || "EVENT"}
                                    </span>

                                </div>

                                {/* Event information */}
                                <div className="event-details-content">

                                    <h1>
                                        {event.title}
                                    </h1>

                                    <div className="event-organizer">

                                        <i className="bi bi-building"></i>

                                        <span>
                                            Organized by{" "}
                                            <strong>
                                                EventHub Pro
                                            </strong>
                                        </span>

                                    </div>

                                    <hr />

                                    <h5>
                                        About the Event
                                    </h5>

                                    <p>
                                        {event.description}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* RIGHT SIDE */}
                        <div className="col-12 col-lg-4">

                            {/* Event information card */}
                            <div className="event-details-sidebar">

                                {/* Date & Time */}
                                <div className="event-detail-item">

                                    <div className="event-detail-icon">
                                        <i className="bi bi-calendar-event"></i>
                                    </div>

                                    <div>
                                        <small>
                                            DATE & TIME
                                        </small>

                                        <strong>
                                            {event.event_date}
                                        </strong>

                                        <span>
                                            {event.start_time} -{" "}
                                            {event.end_time}
                                        </span>
                                    </div>

                                </div>


                                {/* Location */}
                                <div className="event-detail-item">

                                    <div className="event-detail-icon">
                                        <i className="bi bi-geo-alt"></i>
                                    </div>

                                    <div>
                                        <small>
                                            LOCATION
                                        </small>

                                        <strong>
                                            {event.location}
                                        </strong>

                                        <span>
                                            View on Map
                                        </span>
                                    </div>

                                </div>


                                <hr />

                                {/* Capacity */}
                                <div className="capacity-section">

                                    <div className="capacity-header">

                                        <small>
                                            AVAILABLE CAPACITY
                                        </small>

                                        <span>
                                            <strong>
                                                {event.available_seats}
                                            </strong>{" "}
                                            of {event.max_capacity} seats
                                        </span>

                                    </div>

                                    <div className="capacity-progress">

                                        <div
                                            className="capacity-progress-bar"
                                            style={{
                                                width: `${
                                                    event.max_capacity > 0
                                                        ? (
                                                            (event.max_capacity -
                                                                event.available_seats) /
                                                            event.max_capacity
                                                        ) * 100
                                                        : 0
                                                }%`,
                                            }}
                                        ></div>

                                    </div>

                                    <small className="capacity-message">
                                        {event.max_capacity > 0
                                            ? `${Math.round(
                                                ((event.max_capacity -
                                                    event.available_seats) /
                                                    event.max_capacity) *
                                                    100
                                            )}% filled`
                                            : "Capacity unavailable"}
                                    </small>

                                </div>


                                {/* Register */}
                                <button className="register-button">

                                    <i className="bi bi-ticket-perforated"></i>

                                    Register Now

                                </button>


                                {/* Login message */}
                                <div className="login-message">

                                    <i className="bi bi-info-circle"></i>

                                    <span>
                                        Sign in to register and save this
                                        event to your dashboard.
                                    </span>

                                </div>

                            </div>


                            {/* Host information */}
                            <div className="host-information">

                                <div className="host-avatar">
                                    <i className="bi bi-person"></i>
                                </div>

                                <div>
                                    <small>
                                        HOST INFORMATION
                                    </small>

                                    <strong>
                                        EventHub Pro
                                    </strong>

                                    <span>
                                        Event Organizer
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* location and highlights */}
                <div className="event-details-extra">
                    {/* event location */}
                    <div className="event-location-section">
                        <h2>Event Location</h2>

                        <div className="event-map">
                            <MapContainer center={mapCoordinates} zoom={13} scrollWheelZoom={false}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer attribution='&copy; OpenStreetMap contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <Marker position={mapCoordinates}>
                                    <Popup>
                                        <strong>{event.title}</strong>
                                        <br/>
                                        {event.location}
                                    </Popup>
                                </Marker>

                            </MapContainer>

                        </div>

                    </div>

                    {/* event highlights */}
                    <div className="event-highlights">
                        <h2>Event Highlights</h2>

                        <div className="highlight-item">
                            <i className="bi bi-mic-fill"></i>
                        </div>

                        <div>
                            <h5>Keynote Speakers</h5>

                            <p>Hear from the CEOs of top Silicon Valley unicorns.</p>

                        </div>

                        <div className="highlight-item">
                            <i className="bi bi-people-fill"></i>

                            <div>
                                <h5>Networking Lounge</h5>

                                <p>Dedicated space for 1-on-1 industry connections.</p>

                            </div>

                        </div>

                        <div className="highlight-item">
                            <i className="bi bi-fork-knife"></i>

                            <div>
                                <h5>Catered Lunch</h5>

                                <p>Gourmet meals provided for all registered attendees.</p>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}