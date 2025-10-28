import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/Register.css"
import Navbar from "../Components/Navbar";

export default function Register() {
  const [loginForm, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    console.log(loginForm);
    
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/register", loginForm);
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="register-container">
      <div className="register-box">
        <h2>Create Your Quiz Arcade Account</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" name="name" onChange={handleChange}  required />
          <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
          <input type="password" placeholder="Password" name="password" onChange={handleChange} required />
          <input type="text" placeholder="Confirm Password" required />
        
          <button className="register-button" type="submit">Register</button>
        </form>
        <div className="register-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
    </>
  );
}