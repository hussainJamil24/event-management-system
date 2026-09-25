import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import HeroSection from "../components/Home/HeroSection";
import FilterSidebar  from "../components/Home/FilterSidebar";
import EventReults  from "../components/Home/EventResults";
import Footer from "../components/Home/Footer";

import api from "../services/api";

export default function Home() {
    // Filter state
    const [filters, setFilters] = useState({
        search: "",
        categories: [],
        location: "",
        timeframe: "this_month",
        hideSoldOut: false,
    });

    // Events state
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    // Fetch  events
    const fetchEvents = async (currentFilters) => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (currentFilters.search.trim()) {
                params.search = currentFilters.search.trim();
            }

            if (currentFilters.categories.length > 0) {
                params.category = currentFilters.categories.join(",");
            }

             if (currentFilters.location.trim()) {
                params.location = currentFilters.location.trim();
            }

            if (currentFilters.timeframe) {
                params.timeframe = currentFilters.timeframe;
            }

            if (currentFilters.hideSoldOut) {
                params.hide_sold_out = true;
            }

            const response = await api.get("/events/", {
                params: params,
            });

            setEvents(response.data);

        } catch(error) {
            console.error("Failed to fetch events:", error);
            setError("Failed to load events.");
            setEvents([]);

        } finally {
            setLoading(false);
        }

    };

    // Load all events when page opens
    useEffect(() => {
        fetchEvents(filters);
    }, [filters]);

    // Update filter
    const handleFilterChange = (name, value) => {
        setFilters((previousFilters) => ({
            ...previousFilters,
            [name]: value,
        }));
    };

    // Clear filters
    const handleClearFilters = () => {
       setFilters ({
            search: "",
            categories: [],
            location: "",
            timeframe: "",
            hideSoldOut: false,
        });
    };

    return (
        <>
            <Navbar />

            {/* hero */}
            <HeroSection filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
             />

            {/* events section */}
            <div className="events-section container-fluid py-4">
                <div className="row">
                    {/* filter sidebar */}
                    <div className="col-12 col-lg-3">
                        <FilterSidebar 
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* events */}
                    <div className="col-12 col-lg-9">
                        <EventReults events={events}
                            loading={loading}
                            error={error}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />
                    </div>

                </div>

            </div>

            {/* footer */}
            <Footer />
        </>
        
    );
}