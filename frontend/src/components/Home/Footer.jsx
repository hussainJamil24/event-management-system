export default function Footer() {
    return(
        <footer className="footer">
            <div className="container-fluid">
                {/* main footer */}
                <div className="row footer-main">
                    {/* brand */}
                    <div className="col-12 col-lg-6 footer-brand-section">
                        <div className="footer-brand">
                            <i className="bi bi-calendar2-week fs-2"></i>
                            <h5>EventHub Professional</h5>
                        </div>
                        
                        <p className="footer-description">
                            Connecting industry leaders with world- <br/> class events and professional growth <br/> opportunities
                        </p>

                    </div>

                    {/* company */}
                    <div className="col-6 col-sm-4 col-lg-2 footer-column">
                        <h6>COMPANY</h6>
                        <a href="/">About Us</a>
                        <a href="/">Contact Support</a>

                    </div>

                    {/* legal */}
                    <div className="col-6 col-sm-4 col-lg-2 footer-column">
                        <h6>LEGAL</h6>
                        <a href="/">Privacy Policy</a>
                        <a href="/">Terms of Service</a>

                    </div>

                    {/* follow us */}
                    <div className="col-6 col-sm-4 col-lg-2 footer-column">
                        <h6>FOLLOW US</h6>
                        <div className="footer-socials">
                            <a href="/" aria-label="Share">
                                <i className="bi bi-share-fill"></i>
                            </a>

                            <a href="/"  aria-label="Website">
                                <i className="bi bi-globe"></i>
                            </a>

                        </div>

                    </div>

                </div>

                {/* divider */}
                <hr className="footer-divider" />

                {/* bootom footer */}
                <div className="row footer-bottom">
                    <div className="col-12 col-md-6">
                        <p>&copy; 2024 EventHub Professionsl. All rights reserved.</p>
                    </div>

                    <div className="col-12 col-md-6 text-md-end">
                        <p> Built for the Modern Organizer.</p>
                    </div>

                </div>

            </div>

        </footer>
    );
}