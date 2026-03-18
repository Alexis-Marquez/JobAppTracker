export function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h3>JobTrack</h3>
          <p>
            A modern job application tracker to help
            you organize your job search and land
            more interviews.
          </p>
        </div>


        <div className="footer-links">

          <div>
            <h4>Project</h4>
            <a href="/about">About</a>
            <a href="/login">Login</a>
            <a href="/signup">Sign Up</a>
          </div>

          <div>
            <h4>Contact</h4>

            <a
              href="https://github.com/Alexis-Marquez"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <img className="footer-logo" src="/github-mark-white.png" alt="Github Mark White logo" />
            </a>

            <a
              href="https://www.linkedin.com/in/alexis-marquez2/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
              <img className="footer-logo" src="/In-White-72@2x.png" alt="LinkedIn logo white"></img>
            </a>

            <a href="mailto:alexismarq337@gmail.com" target="_blank" rel="noreferrer">
              Email
            </a>

          </div>

        </div>

      </div>


      <div className="footer-bottom">
        © {new Date().getFullYear()} JobTrack
      </div>

    </footer>
  );
}