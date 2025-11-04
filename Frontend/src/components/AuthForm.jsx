import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = () => {
  const [isActive, setIsActive] = useState(false); 
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const BASE_URL = 'https://task-8-itgs.onrender.com'; 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.success(res.data?.message || 'Login successful');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/user/signup`,
        { fullname, email, password },
        { withCredentials: true }
      );
      toast.success(res.data?.message || 'Registration successful');
      setIsActive(false); // back to login
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };


  return (
    <div className="papa">
      <div className={`containe ${isActive ? 'active' : ''}`}>
        {/* Login Form */}
        <div className="for-box logi">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" className="butn">Login</button>
          </form>
        </div>

        {/* Register Form */}
        <div className="for-box register">
          <form onSubmit={handleRegister}>
            <h1>Register</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" className="butn">Register</button>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don’t have an account?</p>
            <button
              type="button"
              className="butn register-butn"
              onClick={() => setIsActive(true)}
            >
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              type="button"
              className="butn login-butn"
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
