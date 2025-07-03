import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useAnimation,
  useInView,
  easeIn,
  easeOut,
} from "framer-motion";
import type { Variants } from "framer-motion";
import {
  FaLeaf,
  FaChartLine,
  FaEye,
  FaClock,
  FaUserShield,
  FaMobileAlt,
  FaCloud,
  FaBullseye,
  FaList,
  FaServer,
  FaUsers,
  FaTachometerAlt,
  FaDatabase,
  FaBrain,
  FaSearch,
  FaBolt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home.module.css";
import logo from "../../assets/HarvestGuardLogo.jpg";
import heroImage from "../../assets/heroImage.jpg";

import Testimonials from "../../components/Testimonials/Testimonials";
import Guide from "../../components/GuideContent/GuideContent";

const Home: React.FC = () => {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const controls = useAnimation();
  const refs = {
    hero: useRef<HTMLElement>(null),
    features: useRef<HTMLElement>(null),
    tech: useRef<HTMLElement>(null),
    stats: useRef<HTMLElement>(null),
    testimonialsGuide: useRef<HTMLElement>(null),
  };

  const heroInView = useInView(refs.hero, { once: false, amount: 0.5 });
  const featuresInView = useInView(refs.features, { once: false, amount: 0.3 });
  const techInView = useInView(refs.tech, { once: false, amount: 0.3 });
  const statsInView = useInView(refs.stats, { once: false, amount: 0.3 });
  const testimonialsGuideInView = useInView(refs.testimonialsGuide, {
    once: false,
    amount: 0.3,
  });

  const isInView = useMemo(
    () => ({
      hero: heroInView,
      features: featuresInView,
      tech: techInView,
      stats: statsInView,
      testimonialsGuide: testimonialsGuideInView,
    }),
    [
      heroInView,
      featuresInView,
      techInView,
      statsInView,
      testimonialsGuideInView,
    ]
  );

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

  const sectionVariants: Variants = {
    initial: { opacity: 0, y: 50 },
    heroVisible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
    heroHidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: easeIn },
    },
    featuresVisible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
    featuresHidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: easeIn },
    },
    techVisible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
    techHidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: easeIn },
    },
    statsVisible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut, staggerChildren: 0.2 },
    },
    statsHidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: easeIn },
    },
    testimonialsGuideVisible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
    testimonialsGuideHidden: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: easeIn },
    },
  };

  const statItemVariants = {
    initial: { opacity: 0, scale: 0.8 },
    statsVisible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  const iconVariants = {
    hover: { scale: 1.2, rotate: 10 },
    tap: { scale: 0.9 },
  };

  const techItems = [
    {
      icon: <GiArtificialIntelligence size={50} />,
      title: "Autoencoders",
      description: "Deep neural networks for unsupervised anomaly detection",
    },
    {
      icon: <FaMobileAlt size={50} />,
      title: "Computer Vision",
      description: "Advanced image processing for product authentication",
    },
    {
      icon: <FaUserShield size={50} />,
      title: "ML Algorithms",
      description:
        "Sophisticated pattern recognition for counterfeit detection",
    },
    {
      icon: <FaCloud size={50} />,
      title: "Cloud AI",
      description: "Scalable infrastructure for real-time processing",
    },
    {
      icon: <FaBrain size={50} />,
      title: "RL Agent",
      description: "Intelligent decision-making based on autoencoder scores",
    },
    {
      icon: <FaSearch size={50} />,
      title: "Anomaly Detection",
      description: "Enhanced pattern recognition for suspicious images",
    },
    {
      icon: <FaBolt size={50} />,
      title: "Real-Time Processing",
      description: "Efficient analysis of image streams for instant results",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    prevArrow: (
      <button className={styles.prevBtn}>
        <FaChevronLeft />
      </button>
    ),
    nextArrow: (
      <button className={styles.nextBtn}>
        <FaChevronRight />
      </button>
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
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
              advanced agricultural product authenticity detection
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
        <div className={styles.startLine}></div>
        <h2 className={styles.featuresTitle}>
          Why Choose <span className={styles.titleHighlight}>HarvestGuard</span>
          ?
          <br />
          <Link to="/about" className={styles.AboutButton}>
            ABOUT
          </Link>
          <span className={styles.pipe}>|</span>
          <Link to="/policy-act" className={styles.AboutButton}>
            POLICY ACT
          </Link>
        </h2>
        <div className={styles.endLine}></div>
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
              agricultural products with{" "}
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
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
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
          <motion.div
            className={styles.statItem}
            variants={statItemVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(72, 187, 120, 0.4)",
            }}
          >
            <FaBullseye size={32} className={styles.statIcon} />
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
            <FaList size={32} className={styles.statIcon} />
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
            <FaEye size={32} className={styles.statIcon} />
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
            <FaServer size={32} className={styles.statIcon} />
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
            <FaUsers size={32} className={styles.statIcon} />
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
            <FaTachometerAlt size={32} className={styles.statIcon} />
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
            <FaDatabase size={32} className={styles.statIcon} />
            <div className={styles.statNumber}>5000+</div>
            <div className={styles.statLabel}>Product Database</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials and Guide Section */}
      <motion.section
        ref={refs.testimonialsGuide}
        className={styles.testimonialsGuideSection}
        initial="initial"
        animate={
          isInView.testimonialsGuide
            ? "testimonialsGuideVisible"
            : "testimonialsGuideHidden"
        }
        variants={sectionVariants}
      >
        <div className={styles.flexContainer}>
          <Guide />
          <Testimonials />
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
