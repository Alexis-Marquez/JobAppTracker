export function Preview() {
  return (
    <section className="preview">
        <div className="preview-text">
      <h2 className="preview-title">Visualize Your Job Search</h2>

      <p className="preview-desc">
        Understand your application pipeline and
        improve your success rate.
      </p>
        </div>
      <img src={"/Stats.png"} alt="dashboard showing a sankey diagram of your job search pipeline" />

    </section>
  );
}