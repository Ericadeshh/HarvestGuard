import { useState, useEffect } from "react";
import { checkServerStatus } from "../../services/api";
import styles from "./ServerStatus.module.css";

const ServerStatus: React.FC = () => {
  const [status, setStatus] = useState<string>("Checking...");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await checkServerStatus();
        setStatus(response.status === "ok" ? "Online" : "Offline");
      } catch {
        setStatus("Offline");
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`${styles.status} ${
        status === "Online" ? styles.online : styles.offline
      }`}
    >
      Server Status: {status}
    </div>
  );
};

export default ServerStatus;
