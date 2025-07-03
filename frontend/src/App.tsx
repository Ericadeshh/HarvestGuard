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
import About from "./pages/About/About";
import ContactUs from "./pages/ContactUs/ContactUs";
import PolicyAct from "./pages/PolicyAct/PolicyAct";
import Help from "./pages/Help/Help";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/scrollToTop/scrollToTop";
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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/policy-act" element={<PolicyAct />} />
          <Route path="/help" element={<Help />} />
          <Route
            path="*"
            element={<Navigate to={token ? "/scan" : "/login"} replace />}
          />
        </Routes>
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
};

export default App;
