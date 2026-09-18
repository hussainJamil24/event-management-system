import eventTechIage from "../../images/event-tech.jpg"
export default function EventCard() {
    return(
        <div className="event-card">
            {/* event image */}
            <div className="event-image-container">
                <img src={eventTechIage} alt="Tech Conference" className="event-image"/>
                <span className="event-category">TECHNOLOGY</span>
                <button className="favorite-button">
                    <i className="bi bi-heart"></i>
                </button>
            </div>

            {/* event information */}
            <div className="event-card-body">
                {/* date */}
                <div className="event-date">
                    <i className="bi bi-calendar"></i>
                    <span>Oct 15, 2024</span>
                </div>

                {/* title */}
                <div className="event-card-title">
                    <h6>Tech Conference 2024: The AI Frontier</h6>

                    {/* location */}
                    <div  className="event-location">
                        <i className="bi bi-geo-alt"></i>
                        <span>New York, NY</span>
                    </div>

                    {/* seats */}
                    <div className="event-seats">
                        <div className="seats-info">
                            <span>SEATS</span>
                            <strong>120/150</strong>
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