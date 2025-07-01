import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  FaLeaf,
  FaChartLine,
  FaEye,
  FaClock,
  FaUserShield,
  FaMobileAlt,
  FaCloud,
} from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import styles from "./Home.module.css";
import logo from "../../assets/HarvestGuardLogo.jpg";
import heroImage from "../../assets/HarvestGuardLogo.jpg";

const Home: React.FC = () => {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const controls = useAnimation();
  const refs = {
    hero: useRef(null),
    features: useRef(null),
    tech: useRef(null),
    stats: useRef(null),
  };

  // Memoize the inView checks to prevent unnecessary re-renders
  const heroInView = useInView(refs.hero, { once: false, amount: 0.5 });
  const featuresInView = useInView(refs.features, { once: false, amount: 0.3 });
  const techInView = useInView(refs.tech, { once: false, amount: 0.3 });
  const statsInView = useInView(refs.stats, { once: false, amount: 0.3 });

  const isInView = useMemo(
    () => ({
      hero: heroInView,
      features: featuresInView,
      tech: techInView,
      stats: statsInView,
    }),
    [heroInView, featuresInView, techInView, statsInView]
  );

  // Animate sections when in/out of view
  useEffect(() => {
    Object.entries(isInView).forEach(([key, inView]) => {
      controls.start(`${key}${inView ? "Visible" : "Hidden"}`);
    });
  }, [isInView, controls]);

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

  // Animation variants with proper typing
  const sectionVariants: Variants = {
    initial: { opacity: 0, y: 50 },
    heroVisible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    heroHidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: "easeIn" },
    },
    featuresVisible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    featuresHidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: "easeIn" },
    },
    techVisible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    techHidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: "easeIn" },
    },
    statsVisible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    statsHidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  const iconVariants = {
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.95 },
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <motion.section
        ref={refs.hero}
        className={styles.heroContainer}
        initial="initial"
        animate={isInView.hero ? "heroVisible" : "heroHidden"}
        variants={sectionVariants}
      >
        <div className={styles.heroContent}>
          <motion.img
            src={logo}
            alt="HarvestGuard"
            className={styles.logo}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
          />
          <h1 className={styles.title}>
            <span className={styles.titleHighlight}>HarvestGuard</span> AI
            Platform
          </h1>
          <p className={styles.subtitle}>
            Protect your crops with{" "}
            <span className={styles.textHighlight}>
              advanced fertilizer authenticity detection
            </span>{" "}
            using unsupervised ML and deep learning neural networks.
          </p>
          <div className={styles.serverStatus}>
            <div
              className={`${styles.statusDot} ${
                serverStatus === "Online"
                  ? styles.statusOnline
                  : styles.statusOffline
              }`}
            />
            <span>
              Server Status: <strong>{serverStatus}</strong>
            </span>
          </div>
          <div className={styles.buttonGroup}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className={styles.ctaButton}>
                Get Started <FaChartLine className={styles.buttonIcon} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/dashboard" className={styles.dashboardButton}>
                View Dashboard <FaLeaf className={styles.buttonIcon} />
              </Link>
            </motion.div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={heroImage} alt="Agricultural Technology" />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={refs.features}
        className={styles.features}
        initial="initial"
        animate={isInView.features ? "featuresVisible" : "featuresHidden"}
        variants={sectionVariants}
      >
        <h2 className={styles.featuresTitle}>
          Why Choose <span className={styles.titleHighlight}>HarvestGuard</span>
          ?
        </h2>
        <div className={styles.featuresGrid}>
          <motion.div className={styles.featureCard} whileHover={{ y: -10 }}>
            <motion.div
              className={styles.featureIcon}
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaEye size={40} />
            </motion.div>
            <h3>Advanced Detection</h3>
            <p>
              Our autoencoder neural network detects counterfeit and expired
              fertilizers with{" "}
              <span className={styles.textHighlight}>95%+ accuracy</span> using
              unsupervised learning.
            </p>
          </motion.div>

          <motion.div className={styles.featureCard} whileHover={{ y: -10 }}>
            <motion.div
              className={styles.featureIcon}
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaClock size={40} />
            </motion.div>
            <h3>Real-time Analysis</h3>
            <p>
              Get{" "}
              <span className={styles.textHighlight}>instant scan results</span>{" "}
              for single images or batch processing with our high-performance AI
              engine.
            </p>
          </motion.div>

          <motion.div className={styles.featureCard} whileHover={{ y: -10 }}>
            <motion.div
              className={styles.featureIcon}
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaUserShield size={40} />
            </motion.div>
            <h3>Data Security</h3>
            <p>
              <span className={styles.textHighlight}>
                Enterprise-grade security
              </span>{" "}
              protects your agricultural data and scan results with end-to-end
              encryption.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Technology Section */}
      <motion.section
        ref={refs.tech}
        className={styles.techSection}
        initial="initial"
        animate={isInView.tech ? "techVisible" : "techHidden"}
        variants={sectionVariants}
      >
        <h2 className={styles.techTitle}>
          Cutting-Edge <span className={styles.titleHighlight}>Technology</span>
        </h2>
        <p className={styles.techDescription}>
          HarvestGuard leverages{" "}
          <span className={styles.textHighlight}>
            unsupervised machine learning
          </span>{" "}
          with convolutional autoencoder neural networks to detect anomalies in
          agricultural products without requiring labeled training data.
        </p>
        <div className={styles.techGrid}>
          <motion.div className={styles.techItem} whileHover={{ y: -5 }}>
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <GiArtificialIntelligence size={50} />
            </motion.div>
            <h3>Autoencoders</h3>
            <p>Deep neural networks for unsupervised anomaly detection</p>
          </motion.div>

          <motion.div className={styles.techItem} whileHover={{ y: -5 }}>
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaMobileAlt size={50} />
            </motion.div>
            <h3>Computer Vision</h3>
            <p>Advanced image processing for product authentication</p>
          </motion.div>

          <motion.div className={styles.techItem} whileHover={{ y: -5 }}>
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaUserShield size={50} />
            </motion.div>
            <h3>ML Algorithms</h3>
            <p>Sophisticated pattern recognition for counterfeit detection</p>
          </motion.div>

          <motion.div className={styles.techItem} whileHover={{ y: -5 }}>
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaCloud size={50} />
            </motion.div>
            <h3>Cloud AI</h3>
            <p>Scalable infrastructure for real-time processing</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        ref={refs.stats}
        className={styles.statsSection}
        initial="initial"
        animate={isInView.stats ? "statsVisible" : "statsHidden"}
        variants={sectionVariants}
      >
        <h2 className={styles.statsTitle}>
          Trusted by{" "}
          <span className={styles.titleHighlight}>Agricultural Experts</span>
        </h2>
        <div className={styles.statsGrid}>
          <motion.div className={styles.statItem} whileHover={{ scale: 1.05 }}>
            <div className={styles.statNumber}>95%</div>
            <div className={styles.statLabel}>Detection Accuracy</div>
          </motion.div>

          <motion.div className={styles.statItem} whileHover={{ scale: 1.05 }}>
            <div className={styles.statNumber}>10K+</div>
            <div className={styles.statLabel}>Products Scanned</div>
          </motion.div>

          <motion.div className={styles.statItem} whileHover={{ scale: 1.05 }}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Monitoring</div>
          </motion.div>

          <motion.div className={styles.statItem} whileHover={{ scale: 1.05 }}>
            <div className={styles.statNumber}>99.9%</div>
            <div className={styles.statLabel}>Uptime</div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
