import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";

interface LoginProps {
  setToken: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [serverStatus, setServerStatus] = useState("Checking...");
  const API_BASE_URL = "http://localhost:8000/api/v1";

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (serverStatus === "Offline") {
      setError(
        "Cannot log in: Backend server is offline. Please try again later."
      );
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role || "user"); // Assuming backend returns role
      setSuccess("Login successful! Redirecting...");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to server"
      );
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>HarvestGuard Login</h1>
        <div className={styles.serverStatus}>
          Server Status:{" "}
          <span
            className={
              serverStatus === "Online"
                ? styles.statusOnline
                : styles.statusOffline
            }
          >
            {serverStatus}
          </span>
        </div>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <button
            type="submit"
            className={styles.loginButton}
            disabled={serverStatus === "Offline"}
          >
            {serverStatus === "Offline" ? "Server Offline" : "Login"}
          </button>
        </form>
        <p className={styles.registerLink}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
