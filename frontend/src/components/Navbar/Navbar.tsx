import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../assets/HarvestGuardLogo.jpg";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="HarvestGuard Logo" />
        <span>HarvestGuard</span>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/upload"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Upload
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/results"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Results
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/guide"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Guide
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
