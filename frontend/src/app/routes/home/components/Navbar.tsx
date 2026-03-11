import { NavLink } from "react-router";
import "./Navbar.css";

export const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink title="Go Home" to="/">JobbTrack</NavLink>
            </div>
            <div className="navbar-links">
                <NavLink className="navbar-link" to="/" end>Home</NavLink>
                <NavLink className="navbar-link" to="/insights">Stats</NavLink>
                <NavLink className="navbar-link" to="/about">About</NavLink>
            </div>
        </nav>
    );
};