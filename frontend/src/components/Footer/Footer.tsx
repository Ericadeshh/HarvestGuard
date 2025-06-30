import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>HarvestGuard</h3>
          <p>Ensuring authenticity in agriculture with AI-powered detection.</p>
        </div>
        <div className={styles.section}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/guide">User Guide</a>
            </li>
            <li>
              <a href="/upload">Scan Products</a>
            </li>
            <li>
              <a href="/results">View Results</a>
            </li>
          </ul>
        </div>
        <div className={styles.section}>
          <h3>Contact</h3>
          <p>Email: support@harvestguard.com</p>
          <p>Phone: +1-800-HARVEST</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© 2025 HarvestGuard. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
