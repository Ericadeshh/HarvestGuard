import React from "react";
import { motion } from "framer-motion";
import {
  FaBullseye,
  FaList,
  FaEye,
  FaServer,
  FaUsers,
  FaTachometerAlt,
  FaDatabase,
} from "react-icons/fa";
import styles from "./StatsSection.module.css";

interface StatsSectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
  variants: import("framer-motion").Variants;
  statItemVariants: import("framer-motion").Variants;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  sectionRef,
  isVisible,
  variants,
  statItemVariants,
}) => {
  return (
    <motion.section
      ref={sectionRef}
      className={styles.statsSection}
      initial="initial"
      animate={isVisible ? "statsVisible" : "statsHidden"}
      variants={variants}
    >
      <h2 className={styles.statsTitle}>
        Trusted by{" "}
        <span className={styles.titleHighlight}>Agricultural Experts</span>
      </h2>
      <div className={styles.statsGrid}>
        <motion.div
          className={styles.statItem}
          variants={statItemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(72, 187, 120, 0.4)",
          }}
        >
          <div className={styles.statIcon}>
            <FaBullseye size={32} />
          </div>
          <div className={styles.statNumber}>95%</div>
          <div className={styles.statLabel}>Detection Accuracy</div>
        </motion.div>
        <motion.div
          className={styles.statItem}
          variants={statItemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(72, 187, 120, 0.4)",
          }}
        >
          <div className={styles.statIcon}>
            <FaList size={32} />
          </div>
          <div className={styles.statNumber}>10K+</div>
          <div className={styles.statLabel}>Products Scanned</div>
        </motion.div>
        <motion.div
          className={styles.statItem}
          variants={statItemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(72, 187, 120, 0.4)",
          }}
        >
          <div className={styles.statIcon}>
            <FaEye size={32} />
          </div>
          <div className={styles.statNumber}>24/7</div>
          <div className={styles.statLabel}>Monitoring</div>
        </motion.div>
        <motion.div
          className={styles.statItem}
          variants={statItemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(72, 187, 120, 0.4)",
          }}
        >
          <div className={styles.statIcon}>
            <FaServer size={32} />
          </div>
          <div className={styles.statNumber}>99.9%</div>
          <div className={styles.statLabel}>Uptime</div>
        </motion.div>
        <motion.div
          className={styles.statItem}
          variants={statItemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(72, 187, 120, 0.4)",
          }}
        >
          <div className={styles.statIcon}>
            <FaUsers size={32} />
          </div>
          <div className={styles.statNumber}>500+</div>
          <div className={styles.statLabel}>Registered Users</div>
        </motion.div>
        <motion.div
          className={styles.statItem}
          variants={statItemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(72, 187, 120, 0.4)",
          }}
        >
          <div className={styles.statIcon}>
            <FaTachometerAlt size={32} />
          </div>
          <div className={styles.statNumber}>2s</div>
          <div className={styles.statLabel}>Average Scan Time</div>
        </motion.div>
        <motion.div
          className={styles.statItem}
          variants={statItemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 20px rgba(72, 187, 120, 0.4)",
          }}
        >
          <div className={styles.statIcon}>
            <FaDatabase size={32} />
          </div>
          <div className={styles.statNumber}>5000+</div>
          <div className={styles.statLabel}>Product Database</div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StatsSection;
