import React, { useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { useLocation } from "react-router-dom";
import { FaQuestionCircle, FaBook, FaEnvelope } from "react-icons/fa";
import GuideContent from "../../components/GuideContent/GuideContent";
import styles from "./Help.module.css";

const Help: React.FC = () => {
  const helpCenterControls = useAnimation();
  const faqControls = useAnimation();
  const guidesControls = useAnimation();
  const contactControls = useAnimation();
  const location = useLocation();
  const helpCenterRef = React.useRef<HTMLDivElement>(null);
  const faqRef = React.useRef<HTMLDivElement>(null);
  const guidesRef = React.useRef<HTMLDivElement>(null);
  const contactRef = React.useRef<HTMLDivElement>(null);

  const isHelpCenterInView = useInView(helpCenterRef, {
    once: false,
    amount: 0.3,
  });
  const isFaqInView = useInView(faqRef, { once: false, amount: 0.3 });
  const isGuidesInView = useInView(guidesRef, { once: false, amount: 0.3 });
  const isContactInView = useInView(contactRef, { once: false, amount: 0.3 });

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const hash = location.hash;
    const sectionMap: {
      [key: string]: React.RefObject<HTMLDivElement | null>;
    } = {
      "#help-center": helpCenterRef,
      "#faq": faqRef,
      "#guides": guidesRef,
      "#contact": contactRef,
    };

    const targetRef = sectionMap[hash];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    helpCenterControls.start(isHelpCenterInView ? "visible" : "hidden");
  }, [isHelpCenterInView, helpCenterControls]);

  useEffect(() => {
    faqControls.start(isFaqInView ? "visible" : "hidden");
  }, [isFaqInView, faqControls]);

  useEffect(() => {
    guidesControls.start(isGuidesInView ? "visible" : "hidden");
  }, [isGuidesInView, guidesControls]);

  useEffect(() => {
    contactControls.start(isContactInView ? "visible" : "hidden");
  }, [isContactInView, contactControls]);

  const faqs = [
    {
      question: "How does HarvestGuard detect counterfeit products?",
      answer:
        "HarvestGuard uses unsupervised machine learning with convolutional autoencoders to analyze images of agricultural products, achieving 95%+ accuracy in detecting counterfeit or expired items.",
    },
    {
      question: "What types of products can be scanned?",
      answer:
        "Our platform supports seeds, fertilizers, pesticides, and other agricultural inputs. Both single and batch scans are available.",
    },
    {
      question: "Is my data secure with HarvestGuard?",
      answer:
        "Yes, we use enterprise-grade encryption to protect your data and scan results, ensuring privacy and security.",
    },
    {
      question: "How do I get started with HarvestGuard?",
      answer:
        "Sign up for an account, log in, and use the Scan feature to upload images of your products. Follow our User Guides for detailed instructions.",
    },
  ];

  return (
    <div className={styles.help}>
      <motion.section
        ref={helpCenterRef}
        className={styles.section}
        initial="hidden"
        animate={helpCenterControls}
        variants={sectionVariants}
        id="help-center"
      >
        <h2 className={styles.sectionTitle}>
          <FaQuestionCircle /> Help Center
        </h2>
        <p className={styles.sectionDescription}>
          Welcome to the HarvestGuard Help Center. Find answers to common
          questions, explore user guides, or contact our support team for
          assistance.
        </p>
      </motion.section>

      <motion.section
        ref={faqRef}
        className={styles.section}
        initial="hidden"
        animate={faqControls}
        variants={sectionVariants}
        id="faq"
      >
        <h2 className={styles.sectionTitle}>
          <FaQuestionCircle /> FAQs
        </h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{faq.question}</h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        ref={guidesRef}
        className={styles.section}
        initial="hidden"
        animate={guidesControls}
        variants={sectionVariants}
        id="guides"
      >
        <h2 className={styles.sectionTitle}>
          <FaBook /> User Guides
        </h2>
        <div className={styles.guidesContent}>
          <GuideContent />
        </div>
      </motion.section>

      <motion.section
        ref={contactRef}
        className={styles.section}
        initial="hidden"
        animate={contactControls}
        variants={sectionVariants}
        id="contact"
      >
        <h2 className={styles.sectionTitle}>
          <FaEnvelope /> Contact Support
        </h2>
        <p className={styles.sectionDescription}>
          Need further assistance? Reach out to our support team via our{" "}
          <a href="/contact" className={styles.link}>
            Contact Us
          </a>{" "}
          page or email us at{" "}
          <a href="mailto:support@harvestguard.com" className={styles.link}>
            support@harvestguard.com
          </a>
          .
        </p>
      </motion.section>
    </div>
  );
};

export default Help;
