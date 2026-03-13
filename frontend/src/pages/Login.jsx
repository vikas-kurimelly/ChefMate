import React, { useState, useEffect } from "react";
import api from "../services/axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {


    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    const token = localStorage.getItem("authToken");

    if (!token) {
      setCheckingToken(false);
      return;
    }

    api
      .get("/auth/validate", { headers: { Authorization: `Bearer ${token}` } }) // Fixed template literal
      .then((res) => {
        if (res.data?.valid) {
          console.log("✅ Token valid. Redirecting to dashboard.");
          navigate("/dashboard");
        } else {
          console.log("❌ Invalid token. Please login again.");
          localStorage.removeItem("authToken");
          setCheckingToken(false);
        }
      })
      .catch((error) => {
        console.error("❌ Token validation error:", error);
        localStorage.removeItem("authToken");
        setCheckingToken(false);
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <motion.div
        className="login-form-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="login-title">Welcome to ChefMate</h2>

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
            <label htmlFor="email" className="login-label">
              <FaUser className="me-2" />
              Email address
            </label>
            <div className="input-group login-input-group">
              <span className="input-group-text">
                <FaUser />
              </span>
              <input
                type="email"
                className="form-control login-input"
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
            <label htmlFor="password" className="login-label">
              <FaLock className="me-2" />
              Password
            </label>
            <div className="input-group login-input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control login-input"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="btn login-button" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0 login-text">
            Don't have an account?{" "}
            <Link to="/register" className="login-link">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;