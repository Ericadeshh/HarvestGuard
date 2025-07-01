import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark bg-primary ${styles.navbar}`}
    >
      <div className="container">
        <Link to="/" className="navbar-brand">
          HarvestGuard
        </Link>
        <div className="navbar-nav">
          <Link to="/upload" className="nav-link">
            Scan
          </Link>
          <Link to="/results" className="nav-link">
            Results
          </Link>
          <Link to="/guide" className="nav-link">
            Guide
          </Link>
        </div>
      </div>
    </nav>
  );
}
