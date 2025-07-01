import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import styles from "./SignUp.module.css";

interface SignUpProps {
  setToken: (token: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [serverStatus, setServerStatus] = useState("Checking...");
  const API_BASE_URL = "http://localhost:8000/api/v1";

  // Check server status periodically
  useEffect(() => {
    const checkStatus = () => {
      fetch("http://localhost:8000/")
        .then((res) => {
          setServerStatus(res.ok ? "Online" : "Offline");
        })
        .catch(() => setServerStatus("Offline"));
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle signup form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (serverStatus === "Offline") {
      setError("Cannot sign up: Server is offline. Please try again later.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      const data = await response.json();
      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role || "farmer");
      setSuccess("Registration successful! Redirecting to scan page...");
      setTimeout(() => (window.location.href = "/scan"), 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to server"
      );
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <h1 className={styles.title}>Join HarvestGuard</h1>
        <div className={styles.serverStatus}>
          Server:{" "}
          <span
            className={
              serverStatus === "Online"
                ? styles.statusOnline
                : styles.statusOffline
            }
          >
            {serverStatus}{" "}
            {serverStatus === "Online" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )}
          </span>
        </div>
        <form onSubmit={handleSignUp}>
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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
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
          {success && (
            <p className={styles.success}>
              <FaCheckCircle className={styles.icon} /> {success}
            </p>
          )}
          {error && (
            <p className={styles.error}>
              <FaExclamationCircle className={styles.icon} /> {error}
            </p>
          )}
          <button
            type="submit"
            className={styles.signupButton}
            disabled={serverStatus === "Offline"}
          >
            {serverStatus === "Offline" ? "Server Offline" : "Sign Up"}
          </button>
        </form>
        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
