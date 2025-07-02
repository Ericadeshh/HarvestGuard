import React from "react";
import {
  FaUserPlus,
  FaUpload,
  FaChartBar,
  FaTachometerAlt,
} from "react-icons/fa";
import styles from "./GuideContent.module.css";

interface GuideStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const guideSteps: GuideStep[] = [
  {
    icon: <FaUserPlus size={40} />,
    title: "Sign Up",
    description:
      "Create a free account on HarvestGuard to access our AI-powered detection tools for agricultural products.",
  },
  {
    icon: <FaUpload size={40} />,
    title: "Upload Product Images",
    description:
      "Take photos of seeds, pesticides, or fertilizers and upload them to our platform for instant analysis.",
  },
  {
    icon: <FaChartBar size={40} />,
    title: "Review AI Results",
    description:
      "Our unsupervised ML and autoencoders analyze images, flagging counterfeit or expired products with 95%+ accuracy.",
  },
  {
    icon: <FaTachometerAlt size={40} />,
    title: "Access Dashboard",
    description:
      "Monitor scan results, track product authenticity, and manage your agricultural inputs in real-time.",
  },
];

const Guide: React.FC = () => {
  return (
    <section className={styles.guide}>
      <h2 className={styles.guideTitle}>
        <FaTachometerAlt /> How to Use{" "}
        <span className={styles.highlight}>HarvestGuard</span>
      </h2>
      <p className={styles.guideDescription}>
        Follow these simple steps to detect counterfeit and expired agricultural
        products using our AI-driven platform.
      </p>
      <div className={styles.guideGrid}>
        {guideSteps.map((step, index) => (
          <div key={index} className={styles.guideCard}>
            <div className={styles.guideIcon}>{step.icon}</div>
            <h3 className={styles.guideStepTitle}>{step.title}</h3>
            <p className={styles.guideStepDescription}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Guide;
