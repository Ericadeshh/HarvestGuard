// src/components/ScrollToTop.tsx
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import styles from "./scrollToTop.module.css";

const ScrollToTop: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the button when the user scrolls down
      if (window.scrollY > 0) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showScrollButton && (
        <button
          className={`${styles.scrollToTopButton} ${styles.floatingButton}`}
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
