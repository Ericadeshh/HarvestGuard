// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/Login";
import Upload from "./components/Upload/Upload";
import Home from "./pages/Home/Home";
import styles from "./App.module.css";

const App: React.FC = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className={styles.container}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/upload"
            element={token ? <Upload /> : <Navigate to="/login" replace />}
          />
          <Route
            path="*"
            element={<Navigate to={token ? "/upload" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
