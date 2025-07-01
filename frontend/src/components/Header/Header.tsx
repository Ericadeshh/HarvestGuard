import { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaQuestionCircle,
  FaCamera,
  FaHome,
  FaSearch,
  FaAngleRight,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/HarvestGuardLogo.jpg";

interface HeaderProps {
  token: string | null;
  setToken: (token: string) => void;
}

const Header: React.FC<HeaderProps> = ({ token, setToken }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "account" | "help" | null
  >(null);
  const [hoverDropdown, setHoverDropdown] = useState<"account" | "help" | null>(
    null
  );
  const [activeMobileSection, setActiveMobileSection] = useState<
    "account" | "help" | null
  >(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!token;
  const role = localStorage.getItem("role");

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
    setActiveDropdown(null);
    setHoverDropdown(null);
    setActiveMobileSection(null);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    setShowMobileMenu(false);
    setActiveDropdown(null);
    setActiveMobileSection(null);
  };

  const handleMobileLinkClick = (destination: string) => {
    setShowMobileMenu(false);
    setActiveDropdown(null);
    setHoverDropdown(null);
    setActiveMobileSection(null);
    navigate(destination);
  };

  const toggleMobileSection = (section: "account" | "help") => {
    setActiveMobileSection((prev) => (prev === section ? null : section));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      accountRef.current &&
      !accountRef.current.contains(event.target as Node) &&
      helpRef.current &&
      !helpRef.current.contains(event.target as Node)
    ) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDropdownVisible = (type: "account" | "help") => {
    return activeDropdown === type || hoverDropdown === type;
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.secondaryNav}>
          <Link to="/" className={styles.secondaryLink}>
            Home
          </Link>
          <span className={styles.separator}>|</span>
          <Link to="/scan" className={styles.secondaryLink}>
            Scan
          </Link>
          <span className={styles.separator}>|</span>
          <Link to="/about" className={styles.secondaryLink}>
            About
          </Link>
          <span className={styles.separator}>|</span>
          <Link to="/contact" className={styles.secondaryLink}>
            Contact
          </Link>
        </div>
        <div className={styles.container}>
          <Link to="/" className={styles.brand}>
            <img src={logo} alt="HarvestGuard" className={styles.brandIcon} />
            HarvestGuard
          </Link>
          <div className={styles.searchWrapper}>
            <form
              className={styles.searchForm}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className={styles.searchInputWrapper}>
                <input type="search" className={styles.searchInput} />
                <label className={styles.searchLabel}>Search scans...</label>
              </div>
              <button type="submit" className={styles.searchButton}>
                <FaSearch className={styles.searchIcon} />
              </button>
            </form>
            <button className={styles.hamburger} onClick={toggleMobileMenu}>
              <FaBars />
            </button>
          </div>
          <form
            className={`${styles.searchForm} ${styles.desktopSearch}`}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles.searchInputWrapper}>
              <input type="search" className={styles.searchInput} />
              <label className={styles.searchLabel}>Search scans...</label>
            </div>
            <button type="submit" className={styles.searchButton}>
              <FaSearch className={styles.searchIcon} />
            </button>
          </form>
          <nav className={styles.desktopNav}>
            <Link
              to="/"
              className={`${styles.navLink} ${
                location.pathname === "/" ? styles.active : ""
              }`}
            >
              <FaHome />
            </Link>
            <div
              className={`${styles.navLink} ${
                activeDropdown === "account" ? styles.active : ""
              }`}
              ref={accountRef}
              onMouseEnter={() => setHoverDropdown("account")}
              onMouseLeave={() => setHoverDropdown(null)}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "account" ? null : "account"
                )
              }
            >
              <FaUser />
              {isDropdownVisible("account") && (
                <div className={styles.dropdown}>
                  {isLoggedIn ? (
                    <>
                      <Link
                        to={
                          role === "admin"
                            ? "/admin/dashboard"
                            : "/user/dashboard"
                        }
                        className={styles.dropdownItem}
                      >
                        Dashboard
                      </Link>
                      <Link to="/scan" className={styles.dropdownItem}>
                        Scan
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`${styles.dropdownItem} ${styles.logoutButton}`}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className={styles.dropdownItem}>
                        Login
                      </Link>
                      <Link to="/signup" className={styles.dropdownItem}>
                        Signup
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <Link
              to="/scan"
              className={`${styles.navLink} ${
                location.pathname === "/scan" ? styles.active : ""
              }`}
            >
              <FaCamera />
            </Link>
            <div
              className={`${styles.navLink} ${
                activeDropdown === "help" ? styles.active : ""
              }`}
              ref={helpRef}
              onMouseEnter={() => setHoverDropdown("help")}
              onMouseLeave={() => setHoverDropdown(null)}
              onClick={() =>
                setActiveDropdown(activeDropdown === "help" ? null : "help")
              }
            >
              <FaQuestionCircle />
              {isDropdownVisible("help") && (
                <div className={styles.dropdown}>
                  <Link to="/help" className={styles.dropdownItem}>
                    Help Center
                  </Link>
                  <Link to="/help#faq" className={styles.dropdownItem}>
                    FAQs
                  </Link>
                  <Link to="/help#guides" className={styles.dropdownItem}>
                    User Guides
                  </Link>
                  <Link to="/contact" className={styles.dropdownItem}>
                    Contact Support
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <div
        className={`${styles.mobileMenu} ${showMobileMenu ? styles.show : ""}`}
      >
        <div className={styles.mobileMenuHeader}>
          <span>HarvestGuard</span>
          <button className={styles.closeButton} onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </div>
        <nav className={styles.mobileNav}>
          <div className={styles.mobileNavSection}>
            <Link
              to="/"
              className={styles.mobileNavTitle}
              onClick={() => handleMobileLinkClick("/")}
            >
              <span>
                <FaHome /> Home
              </span>
            </Link>
          </div>
          <div className={styles.mobileNavSection}>
            <button
              className={styles.mobileNavTitle}
              onClick={() => toggleMobileSection("account")}
            >
              <span>
                <FaUser /> Account
              </span>
              <FaAngleRight
                className={`${styles.openIcon} ${
                  activeMobileSection === "account" ? styles.open : ""
                }`}
              />
            </button>
            {activeMobileSection === "account" && (
              <div className={styles.mobileDropdown}>
                {isLoggedIn ? (
                  <>
                    <Link
                      to={
                        role === "admin"
                          ? "/admin/dashboard"
                          : "/user/dashboard"
                      }
                      className={styles.mobileNavLink}
                      onClick={() =>
                        handleMobileLinkClick(
                          role === "admin"
                            ? "/admin/dashboard"
                            : "/user/dashboard"
                        )
                      }
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/scan"
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileLinkClick("/scan")}
                    >
                      Scan
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`${styles.mobileNavLink} ${styles.logoutButton}`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileLinkClick("/login")}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileLinkClick("/signup")}
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className={styles.mobileNavSection}>
            <Link
              to="/scan"
              className={styles.mobileNavTitle}
              onClick={() => handleMobileLinkClick("/scan")}
            >
              <span>
                <FaCamera /> Scan
              </span>
              <FaAngleRight className={styles.openIcon} />
            </Link>
          </div>
          <div className={styles.mobileNavSection}>
            <button
              className={styles.mobileNavTitle}
              onClick={() => toggleMobileSection("help")}
            >
              <span>
                <FaQuestionCircle /> Help
              </span>
              <FaAngleRight
                className={`${styles.openIcon} ${
                  activeMobileSection === "help" ? styles.open : ""
                }`}
              />
            </button>
            {activeMobileSection === "help" && (
              <div className={styles.mobileDropdown}>
                <Link
                  to="/help"
                  className={styles.mobileNavLink}
                  onClick={() => handleMobileLinkClick("/help")}
                >
                  Help Center
                </Link>
                <Link
                  to="/help#faq"
                  className={styles.mobileNavLink}
                  onClick={() => handleMobileLinkClick("/help#faq")}
                >
                  FAQs
                </Link>
                <Link
                  to="/help#guides"
                  className={styles.mobileNavLink}
                  onClick={() => handleMobileLinkClick("/help#guides")}
                >
                  User Guides
                </Link>
                <Link
                  to="/contact"
                  className={styles.mobileNavLink}
                  onClick={() => handleMobileLinkClick("/contact")}
                >
                  Contact Support
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
      {showMobileMenu && (
        <div className={styles.backdrop} onClick={toggleMobileMenu}></div>
      )}
    </>
  );
};

export default Header;
