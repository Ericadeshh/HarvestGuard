import React from "react";
import { motion } from "framer-motion";
import { FaEye, FaClock, FaUserShield } from "react-icons/fa";
import styles from "./FeaturesSection.module.css";

interface FeaturesSectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
  variants: import("framer-motion").Variants;
  iconVariants: import("framer-motion").Variants;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  sectionRef,
  isVisible,
  variants,
  iconVariants,
}) => {
  return (
    <motion.section
      ref={sectionRef}
      className={styles.features}
      initial="initial"
      animate={isVisible ? "featuresVisible" : "featuresHidden"}
      variants={variants}
    >
      <h2 className={styles.featuresTitle}>
        Why Choose <span className={styles.titleHighlight}>HarvestGuard</span>?
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
  );
};

export default FeaturesSection;
