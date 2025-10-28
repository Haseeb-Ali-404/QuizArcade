import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaBars } from 'react-icons/fa';
import "../CSS/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="navbar">
      <div className="menu-toggle" onClick={toggleMenu}>
        <FaBars />
      </div>

       <div className="navlogo">
        <a href="/" className="logo-link">
          <div className="logo">
            <img
              src="https://i.pinimg.com/originals/a6/5f/c3/a65fc3d31013d6dd66794369cba610bb.png"
              alt="QuizArcade Logo"
            />
          </div>
        </a>
      </div>

      
     

      <nav className={`navopt ${menuOpen ? "show" : ""}`}>
        <Link className="nice" to="/" onClick={toggleMenu}>Home</Link>
        <Link className="nice" to="/dashboard" onClick={toggleMenu}>Dashboard</Link>
        <Link className="nice" to="/chatbot" onClick={toggleMenu}>ChatBot</Link>
        <Link className="nice" to="/create-quiz" onClick={toggleMenu}>Take Quiz</Link>
        <Link className="nice" to="/contact" onClick={toggleMenu}>Contact Us</Link>
      </nav>
      <div className="accountlogo" onClick={() => navigate('/dashboard')}>
        <FaUser aria-label="User Account" />
      </div>

    </header>
  );
};

export default Navbar;

