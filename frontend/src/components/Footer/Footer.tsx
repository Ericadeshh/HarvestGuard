import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";
import styles from "./Footer.module.css";
import logo from "../../assets/HarvestGuardLogo.jpg";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Logo and Description */}
        <div className={styles.footerLogo}>
          <img src={logo} alt="HarvestGuard Logo" className={styles.logo} />
          <h3>HarvestGuard AI</h3>
          <p>
            Advanced AI solutions for agricultural product authentication and
            counterfeit detection.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://twitter.com" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://github.com" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footerLinks}>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/technology">Technology</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.contactInfo}>
          <h4>Contact Us</h4>
          <ul>
            <li>
              <FaEnvelope />
              <span>support@harvestguard.ai</span>
            </li>
            <li>
              <FaPhone />
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <FaMapMarkerAlt />
              <span>123 AgriTech Park, Silicon Valley, CA 94025</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletter}>
          <h4>Subscribe to Our Newsletter</h4>
          <p>
            Stay updated with the latest in agricultural AI technology and
            product updates.
          </p>
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        <p>
          &copy; {new Date().getFullYear()} HarvestGuard AI. All rights
          reserved.
        </p>
        <div className={styles.legalLinks}>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/cookies">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
