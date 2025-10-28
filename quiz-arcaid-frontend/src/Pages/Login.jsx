import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import Navbar from "../Components/Navbar";
import "../CSS/Login.css"
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      

      const res = await axios.post("http://localhost:8000/api/login", form);
      login(res.data.access_token);

      localStorage.setItem("User", res.data?.userId)
      navigate("/");
      window.location.reload()
      
    } catch (err) {
      alert("Invalid Credentials or User not registered!");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="login-container">
      <div className="login-box">
        <h2>Login to Quiz Arcade</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" 
          onChange={handleChange}
           required />
          <input type="password" name="password" placeholder="Password" 
          onChange={handleChange}
          required />
          <button className="login-button" type="submit">Login</button>
        </form>
        <div className="login-footer">
          Don't have an account? <a href="/register">Sign Up</a>
        </div>
      </div>
    </div>
      
    </>
  );
}
