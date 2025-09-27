import "./Navbar.css"

export const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
            </div>
            <div className="navbar-links">
                <a className="navbar-link" href="/">Home</a>
                <a className="navbar-link" href="/insights">Insights</a>
                <a className="navbar-link" href="/stats">Stats</a>
                <a className="navbar-link" href="/about">About</a>
            </div>
        </nav>
    )
}