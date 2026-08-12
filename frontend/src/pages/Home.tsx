import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
    return (
        <div className="home-page">

            <section className="hero-section">
                <div className="hero-content">

                    <div className="hero-badge">
                        🎓 University Lost &amp; Found
                    </div>

                    <h1>
                        Lost Something?
                        <br />
                        <span>Let&apos;s Help You Find It.</span>
                    </h1>

                    <p className="hero-description">
                        A simple and secure platform for reporting,
                        searching, and recovering lost and found items
                        within the university community.
                    </p>

                    <div className="hero-buttons">
                        <Link
                            to="/browse-items"
                            className="primary-button"
                        >
                            🔍 Browse Items
                        </Link>

                        <Link
                            to="/report-lost"
                            className="secondary-button"
                        >
                            + Report Lost Item
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <strong>24/7</strong>
                            <span>Access</span>
                        </div>

                        <div className="hero-stat-divider"></div>

                        <div className="hero-stat">
                            <strong>Easy</strong>
                            <span>Reporting</span>
                        </div>

                        <div className="hero-stat-divider"></div>

                        <div className="hero-stat">
                            <strong>Secure</strong>
                            <span>Platform</span>
                        </div>
                    </div>

                </div>

                <div className="hero-visual">
                    <div className="hero-card-main">

                        <div className="floating-icon icon-search">
                            🔍
                        </div>

                        <div className="floating-icon icon-wallet">
                            👛
                        </div>

                        <div className="floating-icon icon-phone">
                            📱
                        </div>

                        <div className="hero-card-content">

                            <div className="hero-card-icon">
                                🔎
                            </div>

                            <h3>Find What Matters</h3>

                            <p>
                                Search through lost and found
                                items reported by students.
                            </p>

                            <Link to="/browse-items">
                                Explore Items →
                            </Link>

                        </div>

                    </div>
                </div>
            </section>

            <section className="how-section">

                <div className="section-heading">

                    <span>HOW IT WORKS</span>

                    <h2>
                        Finding your belongings
                        <br />
                        made simple.
                    </h2>

                    <p>
                        Our platform makes it easy to report
                        lost items and reconnect them with their owners.
                    </p>

                </div>

                <div className="steps-grid">

                    <div className="step-card">

                        <div className="step-number">
                            01
                        </div>

                        <div className="step-icon">
                            📝
                        </div>

                        <h3>Report</h3>

                        <p>
                            Lost or found something?
                            Submit the details through our
                            simple reporting form.
                        </p>

                    </div>

                    <div className="step-card">

                        <div className="step-number">
                            02
                        </div>

                        <div className="step-icon">
                            🔍
                        </div>

                        <h3>Search</h3>

                        <p>
                            Browse reported items and use
                            filters to quickly find what
                            you are looking for.
                        </p>

                    </div>

                    <div className="step-card">

                        <div className="step-number">
                            03
                        </div>

                        <div className="step-icon">
                            🤝
                        </div>

                        <h3>Reconnect</h3>

                        <p>
                            Found your item?
                            Use the provided contact information
                            to reconnect with its owner.
                        </p>

                    </div>

                </div>

            </section>

            <section className="action-section">

                <div className="action-card">

                    <div>

                        <span className="action-label">
                            LOST SOMETHING?
                        </span>

                        <h2>
                            Start searching for your item.
                        </h2>

                        <p>
                            Browse the latest lost and found
                            reports from the university community.
                        </p>

                    </div>

                    <Link
                        to="/browse-items"
                        className="action-button"
                    >
                        Browse Items →
                    </Link>

                </div>

                <div className="action-card found-card">

                    <div>

                        <span className="action-label">
                            FOUND SOMETHING?
                        </span>

                        <h2>
                            Help someone get it back.
                        </h2>

                        <p>
                            Report the item and help its owner
                            find their belongings.
                        </p>

                    </div>

                    <Link
                        to="/report-found"
                        className="action-button"
                    >
                        Report Found Item →
                    </Link>

                </div>

            </section>

            <section className="home-cta">

                <div className="cta-content">

                    <div className="cta-icon">
                        🎓
                    </div>

                    <h2>
                        Together, we can return
                        <br />
                        what was lost.
                    </h2>

                    <p>
                        Be part of a helpful and responsible
                        university community.
                    </p>

                    <div className="cta-buttons">

                        <Link
                            to="/register"
                            className="primary-button"
                        >
                            Create Account
                        </Link>

                        <Link
                            to="/browse-items"
                            className="cta-link"
                        >
                            Browse without an account →
                        </Link>

                    </div>

                </div>

            </section>

            <footer className="home-footer">

                <div>
                    <strong>
                        University Lost &amp; Found
                    </strong>

                    <span>
                        Helping students reconnect with what matters.
                    </span>
                </div>

                <p>
                    © 2026 University Lost &amp; Found
                </p>

            </footer>

        </div>
    );
}