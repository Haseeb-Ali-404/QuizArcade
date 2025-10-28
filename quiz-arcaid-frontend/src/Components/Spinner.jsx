// src/Components/Loader.js
import React from "react";
import "../CSS/Spinner.css";

const Spinner = () => {
  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Spinner;
