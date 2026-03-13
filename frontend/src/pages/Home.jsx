import { useState, useEffect } from "react";
import {
  FaSearch,
  FaHeart,
  FaUtensils,
  FaRocket,
  FaUser,
  FaSignInAlt,
  FaBrain,
  FaApple,
  FaClock,
  FaShoppingBasket,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/img/logo/logo2.png";
import { Sun, Moon } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setScrolled(scrolled);

      // Logo animation
      const logo = document.getElementById("floating-logo");
      if (logo) {
        if (scrolled) {
          logo.classList.add("scrolled");
        } else {
          logo.classList.remove("scrolled");
        }
      }

      // Check which section is currently in view
      const sections = ["home", "features", "testimonials", "contact"];
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleGetStarted = () => {
    // Redirect to dashboard if authenticated, otherwise to register
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <>
      <header className={`home-header ${scrolled ? "scrolled" : ""}`}>
        <div className="container-fluid px-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="col-md-3 mb-2 mb-md-0">
              <Link
                to="/"
                className="d-inline-flex text-decoration-none align-items-center"
              >
                <img
                  src={logo}
                  alt="ChefMate Logo"
                  className={`nav-logo ${scrolled ? "visible" : ""}`}
                  style={{
                    height: "45px",
                    width: "auto",
                  }}
                />
                <p className="fw-bold fs-4 mx-2 home-logo text-uppercase mb-0 brand-text">
                  Chef<span className="accent-text">Mate</span>
                </p>
              </Link>
            </div>
            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
              <li>
                <a
                  onClick={() => scrollToSection("home")}
                  className={`nav-link ${
                    activeSection === "home" ? "active" : ""
                  }`}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  onClick={() => scrollToSection("features")}
                  className={`nav-link ${
                    activeSection === "features" ? "active" : ""
                  }`}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  onClick={() => scrollToSection("testimonials")}
                  className={`nav-link ${
                    activeSection === "testimonials" ? "active" : ""
                  }`}
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  onClick={() => scrollToSection("contact")}
                  className={`nav-link ${
                    activeSection === "contact" ? "active" : ""
                  }`}
                >
                  Contact
                </a>
              </li>
            </ul>
            <div className="col-md-3 text-end d-flex align-items-center justify-content-end gap-3">
              <button
                onClick={toggleDarkMode}
                className="icon-button"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>

              {isAuthenticated ? (
                // Show Dashboard and Profile buttons for authenticated users
                <>
                  <Link to="/dashboard" className="btn btn-primary me-2">
                    <FaRocket className="me-2" />
                    Dashboard
                  </Link>
                  <Link to="/profile" className="btn btn-primary">
                    <FaUser className="me-2" />
                    Profile
                  </Link>
                </>
              ) : (
                // Show Login and Sign Up buttons for non-authenticated users
                <>
                  <Link to="/login" className="btn btn-primary me-2">
                    <FaSignInAlt className="me-2" />
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    <FaUser className="me-2" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <section
        id="home"
        className="min-vh-100 d-flex align-items-center justify-content-center"
      >
        <div className="container-fluid">
          <div className="text-center d-flex flex-column align-items-center">
            <div className="hero-logo-container mb-4">
              <img
                src={logo}
                alt="ChefMate Logo"
                id="floating-logo"
                className="hero-logo"
              />
            </div>
            <h1 className="display-4 fw-bold text-center mb-3 mt-1">
              Your Personal AI Chef Assistant
            </h1>
            <p className="lead text-center mb-4">
              Discover personalized recipes, plan your meals, and get cooking
              guidance tailored to your preferences. ChefMate uses AI to help
              you create delicious meals that match your dietary needs and
              cooking skills.
            </p>

            <div className="d-grid gap-2 d-md-flex justify-content-center mt-4">
              {/* Update the Get Started button to conditionally navigate */}
              <button
                onClick={handleGetStarted}
                className="btn btn-primary btn-lg px-4 me-md-2 fw-bold"
              >
                <FaRocket className="me-2" />
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the component remains unchanged */}
      <section
        id="features"
        className="min-vh-100 d-flex align-items-center bg-white px-5"
      >
        <div className="container-fluid px-5 position-relative">
          <div className="text-center mb-5">
            <span className="badge bg-warning text-dark mb-3">Features</span>
          </div>
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-6 p-0 overflow-hidden d-flex justify-content-center">
                <img
                  src="https://laurenzcollins.com/uploads/2023/07/what-are-some-interesting-indian-dinner-recipes-i-can-try.webp"
                  alt="Personalized Recipes"
                  className="img-fluid rounded-4 shadow-lg w-100 section-image-full"
                />
              </div>
              <div className="col-lg-6 p-5">
                <h2 className="fw-bold display-5">
                  Explore Indian Food Recipes
                </h2>
                <p className="lead mt-3">
                  Discover a wide variety of delicious Indian recipes with our
                  user-friendly interface. Find recipes based on your
                  preferences and cooking skill level.
                </p>
                <ul className="list-unstyled fs-5 mt-4">
                  <li>
                    <FaSearch className="me-2 text-success" /> Smart recipe
                    search
                  </li>
                  <li>
                    <FaHeart className="me-2 text-success" /> Save your
                    favorites
                  </li>
                  <li>
                    <FaUtensils className="me-2 text-success" /> Step-by-step
                    instructions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="min-vh-100 d-flex align-items-center bg-light px-5">
        <div className="container-fluid">
          <div className="row align-items-center flex-lg-row-reverse">
            <div className="col-lg-6 p-0 overflow-hidden d-flex justify-content-center">
              <img
                src="https://henpicked.net/wp-content/uploads/2021/03/Six-tips-for-smart-meal-planning-via-Henpicked.jpg"
                alt="Meal Planning"
                className="img-fluid rounded-4 shadow-lg w-100"
                style={{ maxHeight: "100vh", objectFit: "cover" }}
              />
            </div>
            <div className="col-lg-6 p-5">
              <h2 className="fw-bold display-5">Smart Meal Planning</h2>
              <p className="lead mt-3">
                Plan your meals for the week with our intelligent meal planner.
                Get balanced meal suggestions and generate shopping lists
                automatically.
              </p>
              <ul className="list-unstyled fs-5 mt-4">
                <li>📅 Weekly meal planning</li>
                <li>🛒 Automatic shopping lists</li>
                <li>⚖️ Balanced nutrition tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="min-vh-100 d-flex align-items-center bg-white px-5"
      >
        <div className="row align-items-center">
          <div className="col-lg-6 p-0 overflow-hidden d-flex justify-content-center">
            <img
              src="https://miro.medium.com/v2/resize:fit:1400/1*lbczThKSS60nkRRhmn9nxw.jpeg"
              alt="Personalized Recipes"
              className="img-fluid rounded-4 shadow-lg w-100 section-image-full"
            />
          </div>
          <div className="col-lg-6 p-5">
            <h2 className="fw-bold display-5">Recipe Generation</h2>
            <p className="lead mt-3">
              Get recipe suggestions based on your available ingredients. Our AI
              analyzes your profile to recommend the perfect recipes for you.
            </p>
            <ul className="list-unstyled fs-5 mt-4">
              <li>
                <FaSearch className="me-2 text-success" /> AI Recipe
                Recommendation
              </li>
              <li>
                <FaHeart className="me-2 text-success" /> Store Recipes
              </li>
              <li>
                <FaUtensils className="me-2 text-success" /> Step-by-step
                instructions
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="min-vh-100 d-flex align-items-center bg-light px-5">
        <div className="container-fluid">
          <div className="row align-items-center flex-lg-row-reverse">
            <div className="col-lg-6 p-0 overflow-hidden d-flex justify-content-center">
              <img
                src="https://www.news-medical.net/image-handler/ts/20240321095621/ri/950/src/images/news/ImageForNews_775237_17110725730208722.jpg"
                alt="Meal Planning"
                className="img-fluid rounded-4 shadow-lg w-100"
                style={{ maxHeight: "100vh", objectFit: "cover" }}
              />
            </div>

            <div className="col-lg-6 p-5">
              <h2 className="fw-bold display-5">
                Image Based Ingredient Recognition
              </h2>
              <p className="lead mt-3">
                Get the list of ingredients from an image of your food. Our AI
                recognizes the ingredients in the image and provides you with a
                list of ingredients.
              </p>
              <ul className="list-unstyled fs-5 mt-4">
                <li>📷 Image-based ingredient recognition</li>
                <li>🔍 Ingredient list generation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="min-vh-100 d-flex align-items-center bg-white px-5"
      >
        <div className="container-fluid px-5 position-relative">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-6 p-0 overflow-hidden d-flex justify-content-center">
                <img
                  src="https://www.prestophoto.com/storage/static/landing/cook-book/inspiration-header.jpg"
                  alt="Personalized Recipes"
                  className="img-fluid rounded-4 shadow-lg w-100 section-image-full"
                />
              </div>
              <div className="col-lg-6 p-5">
                <h2 className="fw-bold display-5">Add Your own Recipes</h2>
                <p className="lead mt-3">
                  Add your own personalized recipes to our platform. Store them
                  in your profile.
                </p>

                <ul className="list-unstyled fs-5 mt-4">
                  <li>
                    <FaSearch className="me-2 text-success" /> Smart recipe
                  </li>
                  <li>
                    <FaHeart className="me-2 text-success" /> Save your
                    Personalized Recipes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="testimonials"
        className="bg-white py-5 position-relative overflow-hidden"
      >
        <div className="container-fluid px-5 position-relative">
          <div className="text-center mb-5">
            <span className="badge bg-warning text-dark mb-3">
              Testimonials
            </span>
          </div>
          <div className="testimonials-slider">
            <div className="testimonials-track">
              {[...Array(2)]
                .flatMap(() => [
                  {
                    text: "ChefMate has changed the way I cook! So easy and intuitive.",
                    name: "Alice Johnson",
                    role: "Home Chef",
                  },
                  {
                    text: "Amazing app for discovering new recipes based on what I have!",
                    name: "Bob Smith",
                    role: "Food Enthusiast",
                  },
                  {
                    text: "Finally, an app that helps reduce food waste and inspires creativity.",
                    name: "Carla Diaz",
                    role: "Nutritionist",
                  },
                ])
                .map((testimonial, index) => (
                  <div key={index} className="testimonial-card">
                    <p className="mb-3">{testimonial.text}</p>
                    <div className="testimonial-author">
                      <h5 className="mb-0">{testimonial.name}</h5>
                      <small className="text-secondary">
                        {testimonial.role}
                      </small>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <style>
          {`
            .testimonials-slider {
              overflow: hidden;
              position: relative;
              padding: 20px 0;
            }

            .testimonials-track {
              display: flex;
              gap: 20px;
              animation: scroll 5s linear infinite;
            }

            .testimonials-track:hover {
              animation-play-state: paused;
            }

            .testimonial-card {
              min-width: 280px;
              flex: 0 0 auto;
              padding: 1.5rem;
              background: white;
              border-radius: 15px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              border: 1px solid rgba(255, 215, 0, 0.1);
              transition: all 0.3s ease;
            }

            .testimonial-card:hover {
              transform: translateY(-5px);
              background: #fff8e8;
              border-color: var(--primary);
              box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
            }

            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-100% / 2));
              }
            }
          `}
        </style>
      </section>
      <section
        id="contact"
        className="min-vh-100 d-flex align-items-center bg-light"
      >
        <div className="container px-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <span className="badge bg-warning text-dark mb-3">
                  Contact Us
                </span>
                <h2 className="display-5 fw-bold mb-3">Get in Touch</h2>
                <p className="lead text-muted">
                  Have questions or suggestions? We'd love to hear from you!
                </p>
              </div>

              <form>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Subject"
                    required
                  />
                </div>

                <div className="mb-4">
                  <textarea
                    className="form-control form-control-lg"
                    rows="5"
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5 fw-bold"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
