import EventCard from "./EventCard";
import { useState } from "react";

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

export default function EventResults({events, loading, error, viewMode, onViewModeChange}) {

    const today = new Date();

    const [calendarDate, setCalendarDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const previousMonth = () => {
        setCalendarDate(
            new Date(
                calendarDate.getFullYear(),
                calendarDate.getMonth() - 1,
                1
            )
        );
    };

    const nextMonth = () => {
        setCalendarDate(
            new Date(
                calendarDate.getFullYear(),
                calendarDate.getMonth() + 1,
                1
            )
        );
    };

    const calendarYear = calendarDate.getFullYear();
    const calendarMonth = calendarDate.getMonth();

    const daysInMonth = getDaysInMonth(
        calendarYear,
        calendarMonth
    );

    const firstDay = getFirstDayOfMonth(
        calendarYear,
        calendarMonth
    );

    const monthName = calendarDate.toLocaleString(
        "default",
        {
            month: "long",
        }
    );


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
            {!loading &&
                !error &&
                events.length > 0 &&
                viewMode === "calendar" && (
                    <div className="event-calendar">

                        {/* calendar header */}
                        <div className="calendar-header">
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="calendar-nav-button"
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>

                            <h4>
                                {monthName} {calendarYear}
                            </h4>

                            <button
                                type="button"
                                onClick={nextMonth}
                                className="calendar-nav-button"
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>

                        {/* days of week */}
                        <div className="calendar-weekdays">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                        </div>

                        {/* calendar days */}
                        <div className="calendar-grid">

                            {/* empty cells before first day */}
                            {Array.from({
                                length: firstDay,
                            }).map((_, index) => (
                                <div
                                    key={`empty-${index}`}
                                    className="calendar-day empty"
                                ></div>
                            ))}

                            {/* actual days */}
                            {Array.from({
                                length: daysInMonth,
                            }).map((_, index) => {
                                const day = index + 1;

                                const dateString =
                                    `${calendarYear}-${String(
                                        calendarMonth + 1
                                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                                const dayEvents = events.filter(
                                    (event) =>
                                        event.event_date === dateString
                                );

                                return (
                                    <div
                                        key={day}
                                        className="calendar-day"
                                    >
                                        <div className="calendar-day-number">
                                            {day}
                                        </div>

                                        {dayEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="calendar-event"
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                )}

            {/* load more */}
            {!loading && events.length > 0 && (
                <div className="text-center mt-4">
                    <button className="load-more">Load More Events</button>
                </div>
            )}
            

        </section>
    );
}