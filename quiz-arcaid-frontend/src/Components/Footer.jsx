import React from 'react';
import { FaEnvelope, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import '../CSS/Footer.css'; // Optional: if you want to move styling here

const Footer = () => {
  return (
    <footer>
      <div className="panel2">
        <h4>
          Have questions? Email us at{" "}
          <a href="mailto:quizarcade@gmail.com">quizarcade@gmail.com</a>
        </h4>
      </div>
      <div className="connect">
        <p>Stay connected:</p>
        <a href="mailto:quizarcade@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
          <FaEnvelope />
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <FaTwitter />
        </a>
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FaFacebook />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
