export function Features() {

  const features = [
    {
      title: "Status Tracking",
      desc: "Track applications from applied → interviewing → offer."
    },
    {
      title: "Application Insights",
      desc: "Visualize your rejection rate and interview progress."
    },
    {
      title: "Pipeline Visualization",
      desc: "See where applications drop off."
    },
    {
      title: "Stay Organized",
      desc: "Keep all job applications in one dashboard."
    }
  ];

  return (
    <section className="features">

      <h2>Everything You Need</h2>

      <div className="feature-grid">
        {features.map((f, i) => (
          <div className="feature-card" key={i}>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}