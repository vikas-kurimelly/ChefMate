import { useState, useEffect, useCallback } from "react";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import chefmateLogo from "../assets/img/logo/logo.png";
import {
  FiEdit2,
  FiUpload,
  FiLock,
  FiUser,
  FiSettings,
  FiTrash2,
  FiLogOut,
} from "react-icons/fi";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("account");
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setEditedUser(storedUser);
      } else {
        try {
          const res = await axios.get("/users/profile");

          const personalRes = await axios.get("/users/personal-settings");
          const personalData = personalRes.data;

          if (res.data) {
            const userData = res.data;
            setUser(userData);
            setEditedUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          if (err.response?.status === 401) {
            handleLogout();
          }
        }
      }
    };
    fetchUser();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (activeTab === "account") {
      if (!editedUser?.username?.trim())
        newErrors.username = "Username is required";
      if (!editedUser?.email?.trim()) newErrors.email = "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser?.email)) {
        newErrors.email = "Invalid email format";
      }
    }
    if (activeTab === "security") {
      if (!passwordData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      if (!passwordData.newPassword) {
        newErrors.newPassword = "New password is required";
      }
      if (passwordData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = useCallback(() => {
    if (!editMode && user) {
      setEditedUser({ ...user });
    }
    setEditMode(!editMode);
  }, [editMode, user]);

  const handleEditedChange = (e) => {
    const { name, value } = e.target;
    if (name === "dietPreferences") {
      const options = e.target.options;
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setEditedUser((prev) => ({ ...prev, [name]: selectedValues }));
    } else if (name === "allergies") {
      setEditedUser((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setEditedUser((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const basicRes = await axios.put("/users/update", {
        username: editedUser.username,
        email: editedUser.email,
        mobile: editedUser.mobile,
      });

      const personalRes = await axios.put("/users/update-personal-settings", {
        age: editedUser.age,
        gender: editedUser.gender,
        weight: editedUser.weight,
        height: editedUser.height,
        cookingSkill: editedUser.cookingSkill,
        dietPreferences: editedUser.dietPreferences,
        allergies: editedUser.allergies,
        preferredCuisines: editedUser.preferredCuisines,
      });

      const updatedUser = {
        ...basicRes.data,
        ...personalRes.data.user,
      };

      setUser(updatedUser);
      setEditedUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditMode(false);
      alert("Profile updated successfully! ✅");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    try {
      const res = await axios.post("/users/changepassword", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.status === 200) {
        alert("Password changed successfully! ✅");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Failed to change password:", err);
      alert(err.response?.data?.message || "Failed to change password ❌");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first! ❌");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    setLoading(true);
    try {
      const res = await axios.post("/users/upload-profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        const updatedUser = {
          ...user,
          profilePicture: res.data.profilePicture, // This is the Cloudinary URL!
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setProfileImagePreview(null);
        alert("Profile photo updated successfully! ✅");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile photo ❌. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete("/users/delete-account");
      handleLogout();
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const profileImageSrc =
    profileImagePreview || user?.profilePicture || "/default-profile.png";

  // Add dark mode state
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      !isDarkMode ? "dark" : "light"
    );
  };

  // Set initial theme
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, []);

  return (
    <div className={`profile-layout ${isDarkMode ? "dark" : "light"}`}>
      {/* Sidebar */}
      <div className="profile-sidebar">
        <div className="profile-sidebar-header">
          <img
            src={chefmateLogo}
            alt="ChefMate"
            className="logo"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          />
          <div className="user-brief">
            <div style={{ position: "relative" }}>
              <img
                src={profileImageSrc}
                alt="Profile"
                className="sidebar-profile-pic"
              />
              {editMode && (
                <label className="upload-icon-wrapper">
                  <FiUpload />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
            <h3>{user?.username || "User Name"}</h3>
            <p>{user?.email || "user@example.com"}</p>
          </div>
        </div>

        <div className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            <FiUser /> Account
          </button>
          <button
            className={`nav-item ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            <FiSettings /> Personal
          </button>
          <button
            className={`nav-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <FiLock /> Security
          </button>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
          <button className="delete-account-btn" onClick={handleDeleteAccount}>
            <FiTrash2 /> Delete Account
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="profile-main">
        <div className="main-header">
          <h1>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
          </h1>
          {activeTab === "account" && (
            <button className="edit-profile-btn" onClick={handleEditToggle}>
              {editMode ? "Cancel" : "Edit Profile"} <FiEdit2 />
            </button>
          )}
        </div>

        <div className="profile-main-content">
          {activeTab === "account" && (
            <div className="account-settings">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={
                    editMode ? editedUser?.username || "" : user?.username || ""
                  }
                  onChange={handleEditedChange}
                  disabled={!editMode}
                  className={errors.username ? "error" : ""}
                />
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editMode ? editedUser?.email || "" : user?.email || ""}
                  onChange={handleEditedChange}
                  disabled={!editMode}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  value={
                    editMode ? editedUser?.mobile || "" : user?.mobile || ""
                  }
                  onChange={handleEditedChange}
                  disabled={!editMode}
                />
              </div>

              {profileImagePreview && (
                <div className="preview-container">
                  <img
                    src={profileImagePreview}
                    alt="Preview"
                    className="preview-image"
                  />
                  <button
                    onClick={handleUpload}
                    className="upload-btn"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Photo"}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "personal" && (
            <div className="personal-settings">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={editMode ? editedUser?.age || "" : user?.age || ""}
                  onChange={handleEditedChange}
                  disabled={!editMode}
                  placeholder="Enter your age"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={
                    editMode ? editedUser?.gender || "" : user?.gender || ""
                  }
                  onChange={handleEditedChange}
                  disabled={!editMode}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={
                    editMode ? editedUser?.weight || "" : user?.weight || ""
                  }
                  onChange={handleEditedChange}
                  disabled={!editMode}
                  placeholder="Enter your weight"
                />
              </div>

              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={
                    editMode ? editedUser?.height || "" : user?.height || ""
                  }
                  onChange={handleEditedChange}
                  disabled={!editMode}
                  placeholder="Enter your height"
                />
              </div>

              <div className="form-group">
                <label>Cooking Skill Level</label>
                <select
                  name="cookingSkill"
                  value={
                    editMode
                      ? editedUser?.cookingSkill || ""
                      : user?.cookingSkill || ""
                  }
                  onChange={handleEditedChange}
                  disabled={!editMode}
                >
                  <option value="">Select skill level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Diet Preferences</label>
                <select
                  name="dietPreferences"
                  value={
                    editMode
                      ? editedUser?.dietPreferences || []
                      : user?.dietPreferences || []
                  }
                  onChange={handleEditedChange}
                  disabled={!editMode}
                  multiple
                  className="diet-preferences-select"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                  <option value="High-Protein">High-Protein</option>
                  <option value="Balanced">Balanced</option>
                </select>
                <small className="select-hint">
                  Hold Ctrl/Cmd to select multiple options
                </small>
              </div>

              <div className="form-group">
                <label>Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={
                    editMode
                      ? editedUser?.allergies?.join(", ") || ""
                      : user?.allergies?.join(", ") || ""
                  }
                  onChange={handleEditedChange}
                  disabled={!editMode}
                  placeholder="e.g., Peanuts, Shellfish, etc."
                />
              </div>

              <div className="form-group">
                <label>Preferred Cuisines</label>
                <input
                  type="text"
                  name="preferredCuisines"
                  value={
                    editMode
                      ? editedUser?.preferredCuisines || ""
                      : user?.preferredCuisines || ""
                  }
                  onChange={handleEditedChange}
                  disabled={!editMode}
                  placeholder="e.g., Italian, Indian, Chinese, etc."
                />
              </div>
            </div>
          )}
          {activeTab === "security" && (
            <div className="security-settings">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={errors.currentPassword ? "error" : ""}
                />
                {errors.currentPassword && (
                  <span className="error-message">
                    {errors.currentPassword}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={errors.newPassword ? "error" : ""}
                />
                {errors.newPassword && (
                  <span className="error-message">{errors.newPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <button
                onClick={handleChangePassword}
                className="change-password-btn"
              >
                Change Password
              </button>

              <div className="delete-account-section">
                <button
                  onClick={handleDeleteAccount}
                  className="delete-account-btn"
                >
                  <FiTrash2 /> Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {editMode && (
        <div className="profile-actions">
          <button onClick={handleSave} className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}{" "}
    </div>
  );
}
