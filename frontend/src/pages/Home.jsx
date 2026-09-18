import Navbar from "../components/Navbar";
import HeroSection from "../components/Home/HeroSection";
import FilterSidebar  from "../components/Home/FilterSidebar";
import EventReults  from "../components/Home/EventResults";

export default function Home() {
    return (
        <>
            <Navbar />

            {/* hero */}
            <HeroSection/>
            {/* events section */}
            <div className="events-section container-fluid py-4">
                <div className="row">
                    {/* filter sidebar */}
                    <div className="col-12 col-lg-3">
                        <FilterSidebar/>
                    </div>

                    {/* events */}
                    <div className="col-12 col-lg-9">
                        <EventReults/>
                    </div>

                </div>

            </div>
            
        </>
        
    );
}