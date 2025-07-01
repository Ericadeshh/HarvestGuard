import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Login from "./components/Login/Login";
import ScanPage from "./components/ScanPage/ScanPage";
import SignUp from "./components/SignUp/SignUp";
import styles from "./App.module.css";

const App: React.FC = () => {
  const [token, setToken] = React.useState<string | null>(
    localStorage.getItem("token") || ""
  );

  return (
    <Router>
      <div className={styles.container}>
        <Header token={token} setToken={setToken} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              !token ? (
                <Login setToken={setToken} />
              ) : (
                <Navigate to="/scan" replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !token ? (
                <SignUp setToken={setToken} />
              ) : (
                <Navigate to="/scan" replace />
              )
            }
          />
          <Route
            path="/scan"
            element={
              token ? (
                <ScanPage token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="*"
            element={<Navigate to={token ? "/scan" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
