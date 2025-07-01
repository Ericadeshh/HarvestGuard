// src/components/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://127.0.0.1:8000/api/v1/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      navigate("/upload");
    } else {
      const err = await res.text();
      setError("Login failed: " + err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h2 className={styles.title}>HarvestGuard Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Login
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
