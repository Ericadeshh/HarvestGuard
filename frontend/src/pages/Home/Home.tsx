import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import logo from "../../assets/HarvestGuardLogo.jpg";

const Home: React.FC = () => {
  const [serverStatus, setServerStatus] = useState("Checking...");

  useEffect(() => {
    const checkStatus = () => {
      fetch("http://localhost:8000/")
        .then((res) => {
          if (res.ok) {
            setServerStatus("Online");
          } else {
            setServerStatus("Offline");
          }
        })
        .catch((err) => {
          console.error("Server status check failed:", err);
          setServerStatus("Offline");
        });
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <img src={logo} alt="HarvestGuard" className={styles.logo} />
        <h1 className={styles.title}>HarvestGuard AI Platform</h1>
        <p className={styles.subtitle}>
          Protect your crops with advanced fertilizer authenticity detection.
        </p>
        <div className={styles.serverStatus}>
          Server Status:{" "}
          <span
            className={
              serverStatus === "Online"
                ? styles.statusOnline
                : styles.statusOffline
            }
          >
            {serverStatus}
          </span>
        </div>
        <Link to="/login" className={styles.ctaButton}>
          Get Started →
        </Link>
      </div>
      <div className={styles.features}>
        <h2 className={styles.featuresTitle}>Why Choose HarvestGuard?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>Accurate Scans</h3>
            <p>
              Detect counterfeit fertilizers with AI-powered image analysis.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Fast Results</h3>
            <p>Get real-time scan results for single or batch images.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Secure Access</h3>
            <p>Login securely to manage your scans and data.</p>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p>
          Contact us at{" "}
          <a href="mailto:support@harvestguard.ai">support@harvestguard.ai</a>
        </p>
        <p>&copy; 2025 HarvestGuard. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;
