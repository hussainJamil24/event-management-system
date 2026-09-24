export default function HeroSection({ filters, onFilterChange, onClearFilters }) {
    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return(
        <section className="hero-section container-fluid">
            {/* hero text */}
            <div className="row justify-content-center">
                <div className="text-center col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
                    <p className="hero-title fw-medium">Experience Excellence at Every Event</p>
                    <p className="hero-descripton">Discover, Book, and attend world-class conferences, workshops, and seminars tailored <br/>for industry leaders</p>
                </div>
            </div>

            {/* search form */}
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-9 col-xl-8 col-xxl-7">
                    <form className="event-search"
                        onSubmit={handleSubmit}
                    >
                        <div className="row align-items-center g-0">
                            {/* Event Name */}
                            <div className="col-12 col-md-3">
                                <div className="event-cont">
                                    <label className="fw-semibold">Event Name</label>
                                    <input className="fw-normal" type="text" placeholder="e.g AI Summit"
                                        value={filters.search} 
                                        onChange={ (event)  => onFilterChange("search", event.target.value) }
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="col-12 col-md-3">
                                <div className="event-cont">
                                    <label className="fw-semibold">CATEGORY</label>
                                    <select
                                        value={filters.category}
                                        onChange={(event) => 
                                            onFilterChange( "category", event.target.value)
                                        }
                                    >
                                        <option value="">
                                            All Categories
                                        </option>

                                        <option value="Technology">
                                            Technology
                                        </option>

                                        <option value="Business">
                                            Business
                                        </option>

                                        <option  value="Marketing">
                                            Marketing
                                        </option>

                                    </select>
                                </div>
                            </div>

                            {/* location */}
                            <div className="col-12 col-md-3">
                                <div className="event-cont">
                                    <label className="fw-semibold">Location</label>
                                    <input className="fw-normal" type="text" placeholder="New York, NY"
                                        value={filters.location}
                                        onChange={(event) => 
                                            onFilterChange("location", event.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* button */}
                            <div className="col-12 col-md-3">
                                <div className="event-cont button-container">
                                    <button type="submit"  className="find-events">
                                        <i className="bi bi-search"></i>
                                        Find Events
                                    </button>

                                    <button type="button" className="find-events mt-2"
                                        onClick={onClearFilters}
                                    >
                                        Clear Filters
                                    </button>

                                </div>
                            </div>

                        </div>

                    </form>

                </div>

            </div>

        </section>
    );
}
