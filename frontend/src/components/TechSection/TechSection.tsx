import React from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import styles from "./TechSection.module.css";
import type { Settings } from "react-slick";

interface TechSectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
  variants: import("framer-motion").Variants;
  iconVariants: import("framer-motion").Variants;
  sliderSettings: Settings; // Added this line
  techItems: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>; // Added this line
}

const TechSection: React.FC<TechSectionProps> = ({
  sectionRef,
  isVisible,
  variants,
  iconVariants,
  techItems, // Added this line
  sliderSettings, // Added this line
}) => {
  return (
    <motion.section
      ref={sectionRef}
      className={styles.techSection}
      initial="initial"
      animate={isVisible ? "techVisible" : "techHidden"}
      variants={variants}
    >
      <h2 className={styles.techTitle}>
        Cutting-Edge <span className={styles.titleHighlight}>Technology</span>
      </h2>
      <p className={styles.techDescription}>
        Harness the power of{" "}
        <span className={styles.textHighlight}>
          unsupervised machine learning
        </span>{" "}
        with convolutional autoencoders and RL agents to detect anomalies in
        agricultural products with unparalleled precision.
      </p>
      <div className={styles.techCarousel}>
        <Slider {...sliderSettings}>
          {techItems.map((item, index) => (
            <motion.div
              key={index}
              className={styles.techItem}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 12px 24px rgba(72, 187, 120, 0.3)",
              }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1,
              }}
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
                className={styles.techIcon}
              >
                {item.icon}
              </motion.div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </Slider>
      </div>
    </motion.section>
  );
};

export default TechSection;
