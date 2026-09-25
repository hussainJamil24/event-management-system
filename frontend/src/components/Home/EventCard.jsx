import { useState } from "react";

export default function EventCard({event}) {
    const [favorite, setFavorite] = useState(false);

    const handleFavorite = () => {
        setFavorite((previous) => !previous);
    };

    return(
        <div className="event-card">
            {/* event image */}
            <div className="event-image-container">
                <img src={ event.image || "https://via.placeholder.com/600x400?text=Event"} 
                    alt={event.title} className="event-image"
                    style={{
                        height: "200px", objectFit: "cover",
                    }}
                />

                <span className="event-category">TECHNOLOGY</span>

                <button className="favorite-button"
                    onClick={handleFavorite}
                    aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <i className={favorite ? "bi bi-heart-fill" :  "bi bi-heart"}></i>
                </button>

            </div>

            {/* event information */}
            <div className="event-card-body">
                {/* date */}
                <div className="event-date">
                    <i className="bi bi-calendar"></i>

                    <span>{event.event_date}</span>

                </div>

                {/* title */}
                <div className="event-card-title">
                    <h6>{event.title}</h6>

                    {/* location */}
                    <div  className="event-location">
                        <i className="bi bi-geo-alt"></i>

                        <span>{event.location}</span>

                    </div>

                    {/* seats */}
                    <div className="event-seats">
                        <div className="seats-info">
                            <span>SEATS</span>

                            <strong>{event.available_seats}</strong>

                        </div>

                        <div className="seat-progress">
                            <div className="seat-progress-bar"></div>
                        </div>

                    </div>

                    {/* details button */}
                        <button className="view-details"> View Details</button>

                </div>

            </div>

        </div>
    );
}