import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./PolicyAct.module.css";

interface Policy {
  title: string;
  description: string;
}

const policies: Policy[] = [
  {
    title: "Data Privacy",
    description:
      "We prioritize your data security with end-to-end encryption and compliance with global privacy standards, ensuring your agricultural data remains protected.",
  },
  {
    title: "AI Ethics",
    description:
      "Our AI models are developed with transparency and fairness, adhering to ethical guidelines to prevent bias in detecting counterfeit and expired agricultural products.",
  },
  {
    title: "Regulatory Compliance",
    description:
      "HarvestGuard complies with agricultural and trade regulations, ensuring our platform meets industry standards for product authenticity verification.",
  },
];

const PolicyAct: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const togglePolicy = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className={styles.policyAct}>
      <h2 className={styles.policyTitle}>
        <FaShieldAlt /> Our Policies
      </h2>
      <p className={styles.policyDescription}>
        At HarvestGuard, we are committed to transparency, security, and
        compliance. Learn about our policies that ensure trust and reliability
        in our AI-driven platform.
      </p>
      <div className={styles.policyList}>
        {policies.map((policy, index) => (
          <div key={index} className={styles.policyItem}>
            <button
              className={styles.policyButton}
              onClick={() => togglePolicy(index)}
              aria-expanded={expandedIndex === index}
              aria-controls={`policy-content-${index}`}
            >
              <span>{policy.title}</span>
              {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div
              id={`policy-content-${index}`}
              className={`${styles.policyContent} ${
                expandedIndex === index ? styles.expanded : ""
              }`}
            >
              <p>{policy.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.policyCta}>
        <Link to="/contact" className={styles.ctaButton}>
          Contact Support for More Information
        </Link>
      </div>
    </section>
  );
};

export default PolicyAct;
