import EventCard from "./EventCard";
export default function EventResults() {
    return(
        <div className="event-results">
            {/* results header */}
            <div className="event-results-header">
                <div>
                    <h6>Discover Events</h6>
                    <span>Showing 24 upcoming sessions</span>
                </div>

                <div className="view-buttons">
                    <button className="active">
                        <i className="bi bi-grid-3x3-gap"></i>
                        Grid
                    </button>

                    <button className="active">
                    <i className="bi bi-calendar3"></i>
                    Calendar
                    </button>

                </div>

            </div>

            {/* event cards */}
            <div className="row g-3">
                <div className="col-12 col-md-6 col-xl-4">
                    <EventCard />
                </div>

                <div className="col-12 col-md-6 col-xl-4">
                    <EventCard />
                </div>

                <div className="col-12 col-md-6 col-xl-4">
                    <EventCard />
                </div>

            </div>

            {/* load more */}
            <div className="text-center mt-4">
                <button className="load-more">Load More Events</button>
            </div>

        </div>
    );
}