import React, { useState } from "react";
import api from "../services/axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/register.css";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
      });
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <motion.div
        className="register-form-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="register-title">Join ChefMate</h2>

        {error && (
          <div
            className="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <div className="flex-shrink-0 me-2">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="register-label">
              Full Name
            </label>
            <div className="input-group register-input-group">
              <input
                type="text"
                className="form-control register-input"
                id="username"
                name="username"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="register-label">
              Email address
            </label>
            <div className="input-group register-input-group">
              <input
                type="email"
                className="form-control register-input"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="mobile" className="register-label">
              Mobile Number
            </label>
            <div className="input-group register-input-group">
              <input
                type="tel"
                className="form-control register-input"
                id="mobile"
                name="mobile"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="register-label">
              Password
            </label>
            <div className="input-group register-input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control register-input"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="register-label">
              Confirm Password
            </label>
            <div className="input-group register-input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control register-input"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text"
                onClick={toggleConfirmPasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn register-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0 register-text">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;