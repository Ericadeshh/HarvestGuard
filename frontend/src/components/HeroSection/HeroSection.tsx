import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { FaChartLine, FaLeaf } from "react-icons/fa";
import logo from "../../assets/HarvestGuardLogo.jpg";
import heroImage from "../../assets/heroImage.jpg";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
  variants: Variants;
  serverStatus: string;
}
const HeroSection: React.FC<HeroSectionProps> = ({
  sectionRef,
  isVisible,
  variants,
  serverStatus,
}) => {
  return (
    <motion.section
      ref={sectionRef}
      className={styles.heroContainer}
      initial="initial"
      animate={isVisible ? "heroVisible" : "heroHidden"}
      variants={variants}
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
  );
};

export default HeroSection;
