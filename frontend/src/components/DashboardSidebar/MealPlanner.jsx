// src/components/DashboardSidebar/MealPlanner.jsx
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPlus, FaUtensils, FaTrash } from 'react-icons/fa';
import CustomMealPlan from './CustomMealPlan';
import { getFoodItemsByCategory } from '../../data/foodItems';
import './MealPlanner.css';

const MealPlanner = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [savedPlans, setSavedPlans] = useState(() => {
    // Try to load saved plans from localStorage
    const savedPlansFromStorage = localStorage.getItem('savedMealPlans');
    return savedPlansFromStorage ? JSON.parse(savedPlansFromStorage) : [];
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Save plans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedMealPlans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  const dietTemplates = [
    {
      id: 1,
      name: 'Weight Gain Plan',
      description: 'High-calorie, nutrient-rich meals for muscle building',
      image:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60',
      calories: '3000-3500',
      macros: { protein: '30%', carbs: '45%', fats: '25%' },
      meals: {
        Breakfast: getFoodItemsByCategory('Breakfast').slice(0, 2),
        Lunch: getFoodItemsByCategory('Lunch').slice(0, 2),
        Dinner: getFoodItemsByCategory('Dinner').slice(0, 2),
        Snacks: getFoodItemsByCategory('Snacks').slice(0, 2),
      },
    },
    {
      id: 2,
      name: 'Weight Loss Plan',
      description: 'Calorie-controlled meals for healthy weight loss',
      image:
        'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&auto=format&fit=crop&q=60',
      calories: '1800-2200',
      macros: { protein: '35%', carbs: '40%', fats: '25%' },
      meals: {
        Breakfast: getFoodItemsByCategory('Breakfast').slice(1, 3),
        Lunch: getFoodItemsByCategory('Lunch').slice(1, 3),
        Dinner: getFoodItemsByCategory('Dinner').slice(1, 3),
        Snacks: getFoodItemsByCategory('Snacks').slice(1, 3),
      },
    },
    {
      id: 3,
      name: 'Keto Plan',
      description: 'High-fat, low-carb meals for ketosis',
      image:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60',
      calories: '2000-2500',
      macros: { protein: '20%', carbs: '5%', fats: '75%' },
      meals: {
        Breakfast: getFoodItemsByCategory('Breakfast').slice(0, 2),
        Lunch: getFoodItemsByCategory('Lunch').slice(0, 2),
        Dinner: getFoodItemsByCategory('Dinner').slice(0, 2),
        Snacks: getFoodItemsByCategory('Snacks').slice(0, 2),
      },
    },
    {
      id: 4,
      name: 'Gym Plan',
      description: 'Performance-focused nutrition for athletes',
      image:
        'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&auto=format&fit=crop&q=60',
      calories: '2500-3000',
      macros: { protein: '30%', carbs: '50%', fats: '20%' },
      meals: {
        Breakfast: getFoodItemsByCategory('Breakfast').slice(0, 2),
        Lunch: getFoodItemsByCategory('Lunch').slice(0, 2),
        Dinner: getFoodItemsByCategory('Dinner').slice(0, 2),
        Snacks: getFoodItemsByCategory('Snacks').slice(0, 2),
      },
    },
    {
      id: 5,
      name: 'Muscle Gain Plan',
      description: 'Protein-rich meals for muscle growth',
      image:
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=60',
      calories: '2800-3200',
      macros: { protein: '35%', carbs: '45%', fats: '20%' },
      meals: {
        Breakfast: getFoodItemsByCategory('Breakfast').slice(0, 2),
        Lunch: getFoodItemsByCategory('Lunch').slice(0, 2),
        Dinner: getFoodItemsByCategory('Dinner').slice(0, 2),
        Snacks: getFoodItemsByCategory('Snacks').slice(0, 2),
      },
    },
    {
      id: 6,
      name: 'Vegetarian Plan',
      description: 'Plant-based meals with complete nutrition',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60',
      calories: '2000-2500',
      macros: { protein: '25%', carbs: '55%', fats: '20%' },
      meals: {
        Breakfast: getFoodItemsByCategory('Breakfast').slice(1, 3),
        Lunch: getFoodItemsByCategory('Lunch').slice(1, 3),
        Dinner: getFoodItemsByCategory('Dinner').slice(1, 3),
        Snacks: getFoodItemsByCategory('Snacks').slice(1, 3),
      },
    },
    {
      id: 7,
      name: 'Non-Vegetarian Plan',
      description: 'Balanced meals with animal protein',
      image:
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60',
      calories: '2200-2700',
      macros: { protein: '30%', carbs: '45%', fats: '25%' },
      meals: {
        Breakfast: getFoodItemsByCategory('Breakfast').slice(0, 2),
        Lunch: getFoodItemsByCategory('Lunch').slice(0, 2),
        Dinner: getFoodItemsByCategory('Dinner').slice(0, 2),
        Snacks: getFoodItemsByCategory('Snacks').slice(0, 2),
      },
    },
    {
      id: 8,
      name: 'Balanced Diet Plan',
      description: 'Well-rounded meals for overall health',
      image:
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=60',
      calories: '2000-2500',
      macros: { protein: '25%', carbs: '50%', fats: '25%' },
      meals: {
        Breakfast: getFoodItemsByCategory('Breakfast').slice(0, 2),
        Lunch: getFoodItemsByCategory('Lunch').slice(0, 2),
        Dinner: getFoodItemsByCategory('Dinner').slice(0, 2),
        Snacks: getFoodItemsByCategory('Snacks').slice(0, 2),
      },
    },
  ];

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const handleUsePlan = (template) => {
    // Create a properly structured meal plan from template
    const newPlan = {
      id: Date.now(),
      name: template.name,
      description: template.description,
      image: template.image,
      days: days.map((day) => ({
        day,
        meals: Object.entries(template.meals).map(([mealType, items]) => ({
          meal: mealType,
          items: items.map((item) => ({
            ...item,
            quantity: 100,
            calories: Math.round(item.calories),
            protein: Math.round(item.protein),
            carbs: Math.round(item.carbs),
            fats: Math.round(item.fats),
          })),
        })),
        macros: {
          calories: parseInt(template.calories.split('-')[0]),
          protein: parseInt(template.macros.protein),
          carbs: parseInt(template.macros.carbs),
          fats: parseInt(template.macros.fats),
        },
      })),
    };

    // Add to saved plans and switch to My Plans tab
    setSavedPlans((prevPlans) => [...prevPlans, newPlan]);
    setActiveTab('my-plans');
  };

  const handleSavePlan = (plan) => {
    setSavedPlans([...savedPlans, { ...plan, id: Date.now() }]);
    setSelectedTemplate(null);
    setActiveTab('my-plans');
  };

  const handleDeletePlan = (planId) => {
    setSavedPlans(savedPlans.filter((plan) => plan.id !== planId));
  };

  return (
    <div className="meal-planner-container">
      {/* Navigation Bar */}
      <nav className="meal-planner-nav">
        <button
          className={`nav-item ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <FaUtensils /> Templates
        </button>
        <button
          className={`nav-item ${activeTab === 'my-plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-plans')}
        >
          <FaCalendarAlt /> My Plans
        </button>
        <button
          className={`nav-item ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          <FaPlus /> Custom Plan
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="meal-planner-content">
        {activeTab === 'templates' && (
          <div className="templates-section">
            <h2>Diet Plan Templates</h2>
            <div className="templates-grid">
              {dietTemplates.map((template) => (
                <div key={template.id} className="template-card">
                  <div className="template-image">
                    <img src={template.image} alt={template.name} />
                  </div>
                  <div className="template-content">
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                    <div className="template-macros">
                      <div className="macro">
                        <span>Calories</span>
                        <span>{template.calories}</span>
                      </div>
                      <div className="macro">
                        <span>Protein</span>
                        <span>{template.macros.protein}</span>
                      </div>
                      <div className="macro">
                        <span>Carbs</span>
                        <span>{template.macros.carbs}</span>
                      </div>
                      <div className="macro">
                        <span>Fats</span>
                        <span>{template.macros.fats}</span>
                      </div>
                    </div>
                    <button
                      className="use-template-btn"
                      onClick={() => handleUsePlan(template)}
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-plans' && (
          <div className="my-plans-section">
            <h2>My Meal Plans</h2>
            {savedPlans.length > 0 ? (
              <div className="saved-plans-grid">
                {savedPlans.map((plan) => (
                  <div key={plan.id} className="saved-plan-card">
                    <div className="plan-header">
                      <h3>{plan.name}</h3>
                      <button
                        className="delete-plan-btn"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="plan-content">
                      <div className="plan-left">
                        <div className="plan-image">
                          <img src={plan.image} alt={plan.name} />
                        </div>
                        <p className="plan-description">{plan.description}</p>
                        <div className="plan-macros">
                          <div className="macro">
                            <span>Calories</span>
                            <span>{plan.days[0].macros.calories} cal</span>
                          </div>
                          <div className="macro">
                            <span>Protein</span>
                            <span>{plan.days[0].macros.protein}g</span>
                          </div>
                          <div className="macro">
                            <span>Carbs</span>
                            <span>{plan.days[0].macros.carbs}g</span>
                          </div>
                          <div className="macro">
                            <span>Fats</span>
                            <span>{plan.days[0].macros.fats}g</span>
                          </div>
                        </div>
                      </div>
                      <div className="plan-right">
                        <div className="weekly-meals">
                          {plan.days.map((day) => (
                            <div key={day.day} className="day-meals">
                              <h4>{day.day}</h4>
                              <div className="meals-list">
                                {day.meals.map((meal) => (
                                  <div key={meal.meal} className="meal-summary">
                                    <span className="meal-type">
                                      {meal.meal}
                                    </span>
                                    <span className="meal-items">
                                      {meal.items
                                        .map((item) => item.name)
                                        .join(', ')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't created any meal plans yet.</p>
                <p>Start by selecting a template or creating a custom plan!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="custom-plan-section">
            <h2>Create Custom Meal Plan</h2>
            <CustomMealPlan
              selectedTemplate={selectedTemplate}
              onSavePlan={handleSavePlan}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
