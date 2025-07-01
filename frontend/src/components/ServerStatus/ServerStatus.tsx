import { useEffect, useState } from "react";
import styles from "./ServerStatus.module.css";

export default function ServerStatus() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    fetch("/api/v1/scan/predict", { method: "OPTIONS" })
      .then((res) => setOnline(res.ok))
      .catch(() => setOnline(false));
  }, []);

  return (
    <div className={styles.status}>
      Server status:{" "}
      <span className={online ? styles.online : styles.offline}>
        {online ? "Online 🟢" : "Offline 🔴"}
      </span>
    </div>
  );
}
