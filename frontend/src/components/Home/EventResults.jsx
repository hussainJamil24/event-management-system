import EventCard from "./EventCard";

export default function EventResults({events, loading, error, viewMode, onViewModeChange}) {
    return(
        <section className="event-results">
            {/* results header */}
            <div className="event-results-header">
                <div>
                    <h6>Discover Events</h6>
                    <span>Showing 24 upcoming sessions</span>
                </div>

                <div className="view-buttons">
                    <button className={viewMode === "grid" ? "active" : ""}
                        onClick={() => onViewModeChange("grid")}
                    >
                        <i className="bi bi-grid-3x3-gap"></i>
                        Grid
                    </button>

                    <button className={viewMode === "calendar" ? "active" : ""}
                        onClick={() => onViewModeChange("calendar")}
                    >
                    <i className="bi bi-calendar3"></i>
                    Calendar
                    </button>

                </div>

            </div>

            {/* loading */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border eventhub-color"  role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>

                    <p className="text-muted mt-2">Loading events...</p>
                </div>

            )}

            {/* error */}
            {!loading && error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* no events */}
            {!loading && !error && events.length === 0 && (
                <div className="text-center py-5">
                    <i className="bi bi-calendar-x fs-1 text-muted"></i>

                    <h4 className="mt-3">
                        No events found
                    </h4>

                    <p className="text-muted">
                        There are currently no available events.
                    </p>

                </div>
            )}

            {/* events grid view */}
            {!loading && !error && events.length > 0 && viewMode === "grid" && (
                <div className="row g-4">
                    {events.map((event)=> (
                        <div className="col-12 col-md-6 col-xl-4" key={event.id}>
                            <EventCard event={event}/>
                        </div>
                    ))}
                </div>
            )}

            {/* events calendar view */}

            {/* load more */}
            {!loading && events.length > 0 && (
                <div className="text-center mt-4">
                    <button className="load-more">Load More Events</button>
                </div>
            )}
            

        </section>
    );
}