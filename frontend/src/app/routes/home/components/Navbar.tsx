import { NavLink } from "react-router";
import "./Navbar.css";

export const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink title="Go Home" to="/">JobbTrack</NavLink>
            </div>
            <div className="navbar-links">
                <NavLink className="navbar-link" to="/home" end>Home</NavLink>
                <NavLink className="navbar-link" to="/stats">Stats</NavLink>
                <NavLink className="navbar-link" to="/about">About</NavLink>
                <NavLink className="logout-button" to="/logout">Logout</NavLink>
            </div>
        </nav>
    );
};