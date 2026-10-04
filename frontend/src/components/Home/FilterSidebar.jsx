export default function FilterSidebar({filters, onFilterChange, categories}) {
    const handleCategoryChange = (category) => {
        const currentCategories = filters.categories;

        if (currentCategories.includes(category)) {
            onFilterChange(
                "categories",
                currentCategories.filter(
                    (item) => item !== category
                )
            );
        } else {
            onFilterChange(
                "categories",
                [...currentCategories, category]
            );
        }
    };


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

                    {categories.map((category) => (
                        <div className="form-check" key={category.id}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`category-${category.id}`}
                                checked={filters.categories.includes(category.name)}
                                onChange={() =>
                                    handleCategoryChange(category.name)
                                }
                            />

                            <label
                                className="form-check-label"
                                htmlFor={`category-${category.id}`}
                            >
                                {category.name}
                            </label>
                        </div>
                    ))}

                </div>

                {/* timeframe */}
                <div className="filter-group">
                    <label className="filter-label fw-lighter fs-5 mb-2" htmlFor="timeframe">TIMEFRAME</label>

                    <select className="form-select" id="timeframe"
                        value={filters.timeframe}
                        onChange={(event) => onFilterChange("timeframe", event.target.value)}
                    >
                        <option value="this_month">This Month</option>
                        <option value="next_month">Next Month</option>
                        <option value="this_year">This Year</option>
                    </select>

                </div>

                {/* avilability */}
                <div className="filter-group">
                    <label className="filter-label fw-lighter fs-5 mb-2" htmlFor="timeframe">AVILABILITY</label>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="soldOut"
                            checked={filters.hideSoldOut}
                             onChange={(event) =>  onFilterChange("hideSoldOut", event.target.checked)}
                        />
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