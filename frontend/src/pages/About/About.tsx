import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { FaLeaf, FaRocket, FaGlobe, FaBrain } from "react-icons/fa";
import styles from "./About.module.css";

const milestones = [
  {
    year: "2020",
    title: "Founded HarvestGuard",
    description:
      "Started with a mission to protect farmers from counterfeit agricultural products using AI.",
    icon: <FaRocket size={40} />,
  },
  {
    year: "2021",
    title: "Developed Autoencoder Model",
    description:
      "Launched our unsupervised ML model for 95%+ accurate detection of counterfeit seeds and fertilizers.",
    icon: <FaBrain size={40} />,
  },
  {
    year: "2023",
    title: "Global Expansion",
    description:
      "Partnered with agricultural cooperatives worldwide to enhance supply chain integrity.",
    icon: <FaGlobe size={40} />,
  },
  {
    year: "2025",
    title: "Sustainable Farming Impact",
    description:
      "Empowered over 500 farmers with real-time detection tools, ensuring sustainable yields.",
    icon: <FaLeaf size={40} />,
  },
];

const milestoneVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: custom * 0.2, ease: "easeOut" },
  }),
};

const About: React.FC = () => {
  return (
    <section className={styles.about}>
      <h2 className={styles.aboutTitle}>
        <FaLeaf /> About HarvestGuard
      </h2>
      <p className={styles.aboutDescription}>
        HarvestGuard was born from a vision to safeguard global agriculture. By
        leveraging cutting-edge unsupervised machine learning and deep learning
        autoencoders, we empower farmers to detect counterfeit and expired
        agricultural products with unparalleled precision. Our platform ensures
        trust, sustainability, and prosperity for farming communities worldwide.
      </p>
      <div className={styles.missionVision}>
        <div className={styles.mission}>
          <h3 className={styles.sectionTitle}>Our Mission</h3>
          <p className={styles.sectionText}>
            To protect farmers from fraudulent agricultural products by
            delivering AI-driven solutions that ensure authenticity and quality,
            fostering sustainable farming practices.
          </p>
        </div>
        <div className={styles.vision}>
          <h3 className={styles.sectionTitle}>Our Vision</h3>
          <p className={styles.sectionText}>
            To create a world where every farmer has access to reliable,
            authentic agricultural inputs, driving global food security and
            environmental stewardship.
          </p>
        </div>
      </div>
      <div className={styles.milestones}>
        <h3 className={styles.milestonesTitle}>Our Journey</h3>
        <div className={styles.milestoneList}>
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              className={styles.milestoneItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={milestoneVariants}
              custom={index}
            >
              <div className={styles.milestoneIcon}>{milestone.icon}</div>
              <div className={styles.milestoneContent}>
                <h4 className={styles.milestoneYear}>{milestone.year}</h4>
                <h5 className={styles.milestoneTitle}>{milestone.title}</h5>
                <p className={styles.milestoneDescription}>
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
