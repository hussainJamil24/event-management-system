import Navbar from "../components/Navbar";
import Footer from "../components/Home/Footer";

export default function MyEvents() {
     const upcomingEvents = [
        {
            id: 1,
            title: "Global Tech Summit 2024",
            date: "Oct 24, 2024",
            image: "https://via.placeholder.com/80x60?text=Tech",
        },
        {
            id: 2,
            title: "Architecture & Design Expo",
            date: "Nov 12, 2024",
            image: "https://via.placeholder.com/80x60?text=Design",
        },
    ];

    const pastEvents = [
        {
            id: 3,
            title: "SaaS Founders Meetup",
            date: "Sep 15, 2024",
            image: "https://via.placeholder.com/80x60?text=SaaS",
        },
    ];


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
                                    {upcomingEvents.length > 0 ? upcomingEvents[0].date
                                        : "No upcoming events"}
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

                                {upcomingEvents.map((event) => (
                                    <div
                                        className="registration-table-row"
                                        key={event.id}
                                    >
                                        <div className="registration-event">
                                            <img src={event.image} alt={event.title} />
                                            <strong>{event.title}</strong>

                                        </div>

                                        <span className="registration-date"> {event.date} </span>

                                        <span>
                                            <span className="registration-status upcoming">
                                                Upcoming
                                            </span>

                                        </span>

                                        <div className="registration-actions">
                                            <button className="cancel-registration"> Cancel </button>

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

                                {pastEvents.map((event) => (
                                    <div  className="registration-table-row" key={event.id}>
                                        <div className="registration-event">
                                            <img src={event.image} alt={event.title} />
                                            <strong>{event.title}</strong>

                                        </div>

                                        <span className="registration-date"> {event.date} </span>

                                        <span>
                                            <span className="registration-status past"> Past </span>
                                        </span>

                                        <div className="registration-actions">
                                            <button className="details-registration"> Details </button>
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