import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container text-center">
        &copy; {new Date().getFullYear()} HarvestGuard. All rights reserved.
      </div>
    </footer>
  );
}
