// src/components/Home.tsx

import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => (
  <div className={styles.home}>
    <img src="/logo.png" alt="HarvestGuard" className={styles.logo} />
    <h1 className={styles.title}>HarvestGuard AI Platform</h1>
    <p className={styles.subtitle}>Detect fertilizer authenticity with ease.</p>
    <Link to="/login" className={styles.link}>
      Get Started →
    </Link>
  </div>
);
export default Home;
