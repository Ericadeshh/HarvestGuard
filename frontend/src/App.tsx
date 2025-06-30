import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ServerStatus from "./components/ServerStatus/ServerStatus";
import Home from "./pages/Home/Home";
import Upload from "./pages/Upload/Upload";
import Results from "./pages/Results/Results";
import Guide from "./pages/Guide/Guide";
import Login from "./pages/Login/Login";
import "./index.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <ServerStatus />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results" element={<Results />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
