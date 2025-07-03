import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaTwitter, FaInstagram } from "react-icons/fa";
import styles from "./ContactUs.module.css";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormStatus("Thank you! Your message has been sent.");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus(null), 5000);
    } else {
      setFormStatus("Please fill out all fields.");
    }
  };

  return (
    <section className={styles.contactUs}>
      <h2 className={styles.contactTitle}>
        <FaEnvelope /> Contact Us
      </h2>
      <p className={styles.contactDescription}>
        Have questions about HarvestGuard? Reach out to our team for support or
        inquiries about our AI-driven agricultural product detection platform.
      </p>
      <div className={styles.contactGrid}>
        <div className={styles.contactInfo}>
          <h3 className={styles.infoTitle}>Get in Touch</h3>
          <p className={styles.infoItem}>
            <FaEnvelope /> Email:{" "}
            <a href="mailto:itjedi37@gmail.com">support@harvestguard.ai</a>
          </p>
          <p className={styles.infoItem}>
            <FaPhone /> Phone: <a href="tel:+254741091661">+1 (234) 567-890</a>
          </p>
          <p className={styles.infoItem}>
            <FaTwitter /> Twitter:{" "}
            <a
              href="https://twitter.com/harvestguard"
              target="_blank"
              rel="noopener noreferrer"
            >
              @HarvestGuard
            </a>
          </p>
          <p className={styles.infoItem}>
            <FaInstagram /> Instagram:{" "}
            <a
              href="https://instagram.com/harvestguard"
              target="_blank"
              rel="noopener noreferrer"
            >
              @HarvestGuard
            </a>
          </p>
        </div>
        <div className={styles.contactForm}>
          <h3 className={styles.formTitle}>Send Us a Message</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                aria-required="true"
              ></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
            {formStatus && <p className={styles.formStatus}>{formStatus}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
