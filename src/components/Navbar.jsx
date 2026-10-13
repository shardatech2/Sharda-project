import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setAboutOpen(false);
  }, [location]);

  // Detect scroll for shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "What We Do", to: "/what-we-do" },
    { label: "Latest Updates", to: "/latest-updates" },
    { label: "Contact", to: "/contact" },
  ];

  const aboutLinks = [
    { label: "About Sharda Welfare", to: "/about" },
    { label: "Our Story", to: "/our-story" },
    { label: "Our Role", to: "/our-role" },
    { label: "Vision & Mission", to: "/vision-mission" },
    { label: "Our Leadership", to: "/leadership" },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar-scrolled" : ""}`}>
        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={scrollToTop} aria-label="Sharda Welfare Home">
            <img src="/logo.webp" alt="Sharda Welfare Foundation" />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <Link
            to="/"
            onClick={scrollToTop}
            className={isActive("/") ? "nav-active" : ""}
          >
            Home
          </Link>

          {/* About Us Dropdown */}
          <div className="nav-dropdown">
            <button
              className={`nav-dropdown-btn${aboutLinks.some((l) => isActive(l.to)) ? " nav-active" : ""}`}
              aria-haspopup="true"
              aria-expanded="false"
            >
              About Us
              <span className="dropdown-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div className="dropdown-menu" role="menu">
              {aboutLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={scrollToTop} role="menuitem">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/what-we-do"
            onClick={scrollToTop}
            className={isActive("/what-we-do") ? "nav-active" : ""}
          >
            What We Do
          </Link>

          <Link
            to="/latest-updates"
            onClick={scrollToTop}
            className={isActive("/latest-updates") ? "nav-active" : ""}
          >
            Latest Updates
          </Link>

          <Link
            to="/contact"
            onClick={scrollToTop}
            className={isActive("/contact") ? "nav-active" : ""}
          >
            Contact
          </Link>
        </div>

        {/* Hamburger Button (Mobile Only) */}
        <button
          className={`hamburger${menuOpen ? " hamburger-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="mobile-overlay" aria-hidden="true" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        className={`mobile-drawer${menuOpen ? " mobile-drawer-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <Link to="/" onClick={scrollToTop}>
            <img src="/logo.webp" alt="Sharda Welfare Foundation" className="mobile-drawer-logo" />
          </Link>
          <button
            className="mobile-drawer-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Nav Links */}
        <nav className="mobile-nav">
          <Link to="/" className={`mobile-nav-link${isActive("/") ? " mobile-nav-active" : ""}`} onClick={scrollToTop}>
            <span>Home</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* About Us Accordion */}
          <div className="mobile-accordion">
            <button
              className={`mobile-accordion-btn${aboutOpen ? " mobile-accordion-open" : ""}${aboutLinks.some((l) => isActive(l.to)) ? " mobile-nav-active" : ""}`}
              onClick={() => setAboutOpen((v) => !v)}
              aria-expanded={aboutOpen}
            >
              <span>About Us</span>
              <svg
                className={`accordion-chevron${aboutOpen ? " accordion-chevron-open" : ""}`}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`mobile-accordion-panel${aboutOpen ? " mobile-accordion-panel-open" : ""}`}>
              {aboutLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`mobile-sub-link${isActive(link.to) ? " mobile-nav-active" : ""}`}
                  onClick={scrollToTop}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/what-we-do" className={`mobile-nav-link${isActive("/what-we-do") ? " mobile-nav-active" : ""}`} onClick={scrollToTop}>
            <span>What We Do</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link to="/latest-updates" className={`mobile-nav-link${isActive("/latest-updates") ? " mobile-nav-active" : ""}`} onClick={scrollToTop}>
            <span>Latest Updates</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link to="/contact" className={`mobile-nav-link${isActive("/contact") ? " mobile-nav-active" : ""}`} onClick={scrollToTop}>
            <span>Contact</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </nav>

        {/* Drawer Footer */}
        <div className="mobile-drawer-footer">
          <p className="mobile-drawer-tagline">Building a Healthier &amp; Brighter Tomorrow</p>
          <div className="mobile-drawer-social">
            <a href="https://x.com/shardawelfare21" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="mobile-social-icon">
              {/* X (formerly Twitter) logo */}
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.625 5.905-5.625Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/shardawelfare21" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="mobile-social-icon">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/shardawelfare21/" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="mobile-social-icon">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;