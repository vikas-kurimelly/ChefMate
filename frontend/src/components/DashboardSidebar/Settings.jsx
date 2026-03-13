import React, { useState, useEffect } from 'react';
import {
  FaSave,
  FaBell,
  FaUtensils,
  FaWeight,
  FaChartLine,
} from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
    },
    goals: {
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      weight: '',
      targetWeight: '',
    },
    notifications: {
      mealReminders: false,
      weeklyReports: false,
      progressAlerts: false,
      waterReminders: false,
    },
    preferences: {
      cuisine: 'All',
      mealSize: 'Medium',
      spiceLevel: 'Medium',
      cookingTime: '30',
    },
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('mealPlannerSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('mealPlannerSettings', JSON.stringify(settings));
    // You can add a success notification here
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Meal Planner Settings</h2>
        <button className="save-settings-btn" onClick={handleSaveSettings}>
          <FaSave /> Save Settings
        </button>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <div className="section-header">
            <FaUtensils />
            <h3>Dietary Preferences</h3>
          </div>
          <div className="section-content">
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.dietary.vegetarian}
                onChange={(e) =>
                  handleSettingChange('dietary', 'vegetarian', e.target.checked)
                }
              />
              Vegetarian
            </label>
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.dietary.vegan}
                onChange={(e) =>
                  handleSettingChange('dietary', 'vegan', e.target.checked)
                }
              />
              Vegan
            </label>
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.dietary.glutenFree}
                onChange={(e) =>
                  handleSettingChange('dietary', 'glutenFree', e.target.checked)
                }
              />
              Gluten-Free
            </label>
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.dietary.dairyFree}
                onChange={(e) =>
                  handleSettingChange('dietary', 'dairyFree', e.target.checked)
                }
              />
              Dairy-Free
            </label>
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.dietary.nutFree}
                onChange={(e) =>
                  handleSettingChange('dietary', 'nutFree', e.target.checked)
                }
              />
              Nut-Free
            </label>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <FaWeight />
            <h3>Daily Goals</h3>
          </div>
          <div className="section-content">
            <div className="setting-input">
              <label>Daily Calories</label>
              <input
                type="number"
                value={settings.goals.calories}
                onChange={(e) =>
                  handleSettingChange('goals', 'calories', e.target.value)
                }
                placeholder="e.g., 2000"
              />
            </div>
            <div className="setting-input">
              <label>Protein (g)</label>
              <input
                type="number"
                value={settings.goals.protein}
                onChange={(e) =>
                  handleSettingChange('goals', 'protein', e.target.value)
                }
                placeholder="e.g., 150"
              />
            </div>
            <div className="setting-input">
              <label>Carbs (g)</label>
              <input
                type="number"
                value={settings.goals.carbs}
                onChange={(e) =>
                  handleSettingChange('goals', 'carbs', e.target.value)
                }
                placeholder="e.g., 250"
              />
            </div>
            <div className="setting-input">
              <label>Fats (g)</label>
              <input
                type="number"
                value={settings.goals.fats}
                onChange={(e) =>
                  handleSettingChange('goals', 'fats', e.target.value)
                }
                placeholder="e.g., 70"
              />
            </div>
            <div className="setting-input">
              <label>Current Weight (kg)</label>
              <input
                type="number"
                value={settings.goals.weight}
                onChange={(e) =>
                  handleSettingChange('goals', 'weight', e.target.value)
                }
                placeholder="e.g., 70"
              />
            </div>
            <div className="setting-input">
              <label>Target Weight (kg)</label>
              <input
                type="number"
                value={settings.goals.targetWeight}
                onChange={(e) =>
                  handleSettingChange('goals', 'targetWeight', e.target.value)
                }
                placeholder="e.g., 65"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <FaBell />
            <h3>Notifications</h3>
          </div>
          <div className="section-content">
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.notifications.mealReminders}
                onChange={(e) =>
                  handleSettingChange(
                    'notifications',
                    'mealReminders',
                    e.target.checked
                  )
                }
              />
              Meal Reminders
            </label>
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.notifications.weeklyReports}
                onChange={(e) =>
                  handleSettingChange(
                    'notifications',
                    'weeklyReports',
                    e.target.checked
                  )
                }
              />
              Weekly Progress Reports
            </label>
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.notifications.progressAlerts}
                onChange={(e) =>
                  handleSettingChange(
                    'notifications',
                    'progressAlerts',
                    e.target.checked
                  )
                }
              />
              Progress Alerts
            </label>
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.notifications.waterReminders}
                onChange={(e) =>
                  handleSettingChange(
                    'notifications',
                    'waterReminders',
                    e.target.checked
                  )
                }
              />
              Water Intake Reminders
            </label>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <FaChartLine />
            <h3>Preferences</h3>
          </div>
          <div className="section-content">
            <div className="setting-select">
              <label>Preferred Cuisine</label>
              <select
                value={settings.preferences.cuisine}
                onChange={(e) =>
                  handleSettingChange('preferences', 'cuisine', e.target.value)
                }
              >
                <option value="All">All Cuisines</option>
                <option value="Indian">Indian</option>
                <option value="Western">Western</option>
                <option value="Chinese">Chinese</option>
                <option value="Mediterranean">Mediterranean</option>
              </select>
            </div>
            <div className="setting-select">
              <label>Meal Size</label>
              <select
                value={settings.preferences.mealSize}
                onChange={(e) =>
                  handleSettingChange('preferences', 'mealSize', e.target.value)
                }
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <div className="setting-select">
              <label>Spice Level</label>
              <select
                value={settings.preferences.spiceLevel}
                onChange={(e) =>
                  handleSettingChange(
                    'preferences',
                    'spiceLevel',
                    e.target.value
                  )
                }
              >
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Hot">Hot</option>
              </select>
            </div>
            <div className="setting-select">
              <label>Max Cooking Time (minutes)</label>
              <select
                value={settings.preferences.cookingTime}
                onChange={(e) =>
                  handleSettingChange(
                    'preferences',
                    'cookingTime',
                    e.target.value
                  )
                }
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
