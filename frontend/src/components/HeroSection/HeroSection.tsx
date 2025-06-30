import styles from "./HeroSection.module.css";
import logo from "../../assets/HarvestGuardLogo.jpg";

const HeroSection: React.FC = () => {
  return (
    <section className={styles.hero}>
      <img src={logo} alt="HarvestGuard Logo" className={styles.logo} />
      <h1>Welcome to HarvestGuard</h1>
      <p>
        AI-powered solution for detecting expired and counterfeit agricultural
        products.
      </p>
    </section>
  );
};

export default HeroSection;
