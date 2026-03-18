export function Hero() {
  return (
    <section className="hero">

      <div className="hero-text">
        <h1 className="hero-title">Because spreadsheets weren't made for job hunting.</h1>

        <p className="hero-desc">
          JobTrack helps you organize applications, track interview progress,
          and visualize your job search pipeline.
        </p>

        <div className="hero-buttons">
          <a href="/signup" className="primary">Start your tracker</a>
          <a href="/login" className="secondary">Login</a>
        </div>
      </div>

      <div className="hero-image">
        <img src={"/Dashboard.png"} alt="Interface showing a Kanban board of job application statuses" />
      </div>

    </section>
  );
}