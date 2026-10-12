import React from "react";
import { Link } from "react-router-dom";

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function Navbar() {
  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">

        <Link to="/" onClick={scrollToTop}>
          <img src="/logo.webp" alt="Sharda Welfare" />
        </Link>

      </div>


      {/* Navigation Links */}
      <div className="nav-links">

        {/* Home */}
       <Link to="/" onClick={scrollToTop}>Home</Link>


        {/* About Us Dropdown */}
        <div className="nav-dropdown">

          <button className="nav-dropdown-btn">
            About Us 
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div className="dropdown-menu">

          <Link to="/about" onClick={scrollToTop}>
  About Sharda Welfare
</Link>

            
            <Link to="/our-story" onClick={scrollToTop}>
  Our Story
</Link>

           <Link to="/our-role" onClick={scrollToTop}>
  Our Role
</Link>

            <Link to="/vision-mission" onClick={scrollToTop}>
              Vision &amp; Mission
            </Link>

            <Link to="/leadership" onClick={scrollToTop}>
              Our Leadership
            </Link>

          </div>

        </div>


        {/* What We Do */}
        <Link to="/what-we-do" onClick={scrollToTop}>What We Do</Link>


        {/* Latest Updates */}
        <Link to="/latest-updates" onClick={scrollToTop}>Latest Updates</Link>


        {/* Contact */}

        <Link to="/contact" onClick={scrollToTop}>
  Contact
</Link>

      </div>


    </nav>
  );
}

export default Navbar;