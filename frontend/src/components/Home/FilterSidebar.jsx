export default function FilterSidebar() {
    return(
        <div className="filter-sidebar">
            {/* filter card */}
            <div className="filter-card d-flex flex-column justify-content-center gap-3">
                <div className="filter-title">
                    <i className="bi bi-sliders pe-2"></i>
                    <span>Filter Results</span>
                </div>

                {/* categories */}
                <div className="filter-group">
                    <label className="filter-label fw-lighter fs-5 mb-2">CATEGORIES</label>

                    <div className="form-check">
                        <input  className="form-check-input" type="checkbox" id="technology"/>
                        <label  className="form-check-label" htmlFor="technology">Technology</label>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="design"/>
                        <label  className="form-check-label" htmlFor="design">Design</label>

                    </div>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="marketing"/>
                        <label className="form-check-label" htmlFor="marketing">Marketing</label>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="finance"/>
                        <label className="form-check-label" htmlFor="finance">Finance</label>
                    </div>

                </div>

                {/* timeframe */}
                <div className="filter-group">
                    <label className="filter-label fw-lighter fs-5 mb-2" htmlFor="timeframe">TIMEFRAME</label>

                    <select className="form-select" id="timeframe">
                        <option>This Month</option>
                        <option>Next 3 Month</option>
                        <option>This Year</option>
                    </select>

                </div>

                {/* avilability */}
                <div className="filter-group">
                    <label className="filter-label fw-lighter fs-5 mb-2" htmlFor="timeframe">AVILABILITY</label>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="soldOut"/>
                        <label className="form-check-label" htmlFor="soldOut">Hide sold out</label>
                    </div>

                </div>

            </div>

            {/* need help */}
            <div className="help-card text-center">
                <h6>Need Help?</h6>

                <p>
                    Contact our support for group <br/>bookings and enterprise rates.
                </p>

                <a href="/" className="fw-bold">Get Support →</a>
            </div>

        </div>
    );
}