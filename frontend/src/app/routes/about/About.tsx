import { Navbar } from "../home/components/Navbar";
import "./about.css";

export const About = () => {
  return (
    <div className="container-page">
      <Navbar />
      <main className="about-wrapper">
        <section className="about-hero">
          <h1>About Job Application Tracker</h1>
          <p className="hero-subtitle">
            One place to manage your job search journey. Stop losing track 
            of emails and start landing more offers.
          </p>
        </section>

        <section className="features-section">
          <h2>Core Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Status Tracking</h3>
              <p>Monitor your progress from initial application to the final offer letter.</p>
            </div>
             <div className="feature-card">
              <h3>Insights</h3>
              <p>Visualize your success rate and identify which stages need improvement.</p>
            </div>
            </div>
        </section>
        <section className="features-section">
            <h2>Future Enhancements</h2>
            <div className="features-grid">
            <div className="feature-card">
              <h3>Smart Reminders</h3>
              <p>Never miss a follow-up or a technical interview again with automated alerts.</p>
            </div>
            <div className="feature-card">
              <h3>Stay Organized</h3>
              <p>Keep your resumes, cover letters, and interview notes tied to each job.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};