import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSearch, FaSave, FaFilter } from 'react-icons/fa';
import { foodItems, getAvailableCuisines } from '../../data/foodItems';
import './CustomMealPlan.css';

const CustomMealPlan = ({ selectedTemplate, onSavePlan }) => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [mealPlan, setMealPlan] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [planName, setPlanName] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [availableCuisines] = useState(['All', ...getAvailableCuisines()]);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  useEffect(() => {
    // Initialize meal plan structure regardless of template
    const initialMealPlan = {};
    days.forEach((day) => {
      initialMealPlan[day] = {};
      meals.forEach((meal) => {
        initialMealPlan[day][meal] = [];
      });
    });
    setMealPlan(initialMealPlan);

    // If there's a template, set the plan name
    if (selectedTemplate) {
      setPlanName(`${selectedTemplate.name} - Custom Plan`);
    }
  }, [selectedTemplate]);

  const handleAddFood = (food) => {
    setMealPlan((prevPlan) => {
      const updatedPlan = { ...prevPlan };
      if (!updatedPlan[selectedDay]) {
        updatedPlan[selectedDay] = {};
      }
      if (!updatedPlan[selectedDay][selectedMeal]) {
        updatedPlan[selectedDay][selectedMeal] = [];
      }
      // Check if the food item already exists in the current meal
      const isDuplicate = updatedPlan[selectedDay][selectedMeal].some(
        (item) => item.id === food.id
      );

      // Only add if it's not a duplicate
      if (!isDuplicate) {
        updatedPlan[selectedDay][selectedMeal].push({ ...food, quantity: 100 });
      }
      return updatedPlan;
    });
    setShowFoodSearch(false);
    setSearchQuery('');
  };

  const handleQuantityChange = (dayKey, mealKey, foodIndex, value) => {
    setMealPlan((prevPlan) => {
      const updatedPlan = { ...prevPlan };
      updatedPlan[dayKey][mealKey][foodIndex].quantity = value;
      return updatedPlan;
    });
  };

  const handleRemoveFood = (dayKey, mealKey, foodIndex) => {
    setMealPlan((prevPlan) => {
      const updatedPlan = { ...prevPlan };
      updatedPlan[dayKey][mealKey] = updatedPlan[dayKey][mealKey].filter(
        (_, i) => i !== foodIndex
      );
      return updatedPlan;
    });
  };

  const calculateMealMacros = (items) => {
    return items.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories * item.quantity) / 100,
        protein: acc.protein + (item.protein * item.quantity) / 100,
        carbs: acc.carbs + (item.carbs * item.quantity) / 100,
        fats: acc.fats + (item.fats * item.quantity) / 100,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const calculateDayMacros = (dayMeals) => {
    const macros = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    Object.values(dayMeals).forEach((mealItems) => {
      const mealMacros = calculateMealMacros(mealItems);
      macros.calories += mealMacros.calories;
      macros.protein += mealMacros.protein;
      macros.carbs += mealMacros.carbs;
      macros.fats += mealMacros.fats;
    });
    return macros;
  };

  const handleSavePlan = () => {
    // Validate if plan has a name
    if (!planName.trim()) {
      alert('Please enter a plan name');
      return;
    }

    // Validate if plan has at least one meal
    let hasMeals = false;
    for (const day in mealPlan) {
      for (const meal in mealPlan[day]) {
        if (mealPlan[day][meal].length > 0) {
          hasMeals = true;
          break;
        }
      }
      if (hasMeals) break;
    }

    if (!hasMeals) {
      alert('Please add at least one meal to your plan');
      return;
    }

    // Create a properly structured plan
    const plan = {
      id: Date.now(),
      name: planName,
      description: selectedTemplate
        ? `Custom plan based on ${selectedTemplate.name}`
        : 'Custom meal plan',
      days: days.map((day) => ({
        day,
        meals: meals.map((meal) => ({
          meal,
          items: mealPlan[day]?.[meal] || [],
        })),
        macros: calculateDayMacros(mealPlan[day] || {}),
      })),
    };

    // Call the parent's onSavePlan function
    onSavePlan(plan);

    // Reset the form
    setMealPlan({});
    setPlanName('');
    setSelectedDay('Monday');
    setSelectedMeal('Breakfast');
    setShowFoodSearch(false);
  };

  const filteredFoodItems = foodItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCuisine =
      selectedCuisine === 'All' || item.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="custom-meal-plan">
      <div className="plan-header">
        <input
          type="text"
          className="plan-name-input"
          placeholder="Enter plan name..."
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
        />
        <button className="save-plan-btn" onClick={handleSavePlan}>
          <FaSave /> Save Plan
        </button>
      </div>

      <div className="plan-controls">
        <div className="day-selector">
          {days.map((day) => (
            <button
              key={day}
              className={`day-btn ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="meal-selector">
          {meals.map((meal) => (
            <button
              key={meal}
              className={`meal-btn ${selectedMeal === meal ? 'active' : ''}`}
              onClick={() => setSelectedMeal(meal)}
            >
              {meal}
            </button>
          ))}
        </div>
      </div>

      <div className="meal-content">
        <div className="meal-header">
          <h3>
            {selectedMeal} for {selectedDay}
          </h3>
          <button
            className="add-food-btn"
            onClick={() => setShowFoodSearch(true)}
          >
            <FaPlus /> Add Food
          </button>
        </div>

        {showFoodSearch && (
          <div className="food-search">
            <div className="search-controls">
              <div className="search-bar">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search for food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="cuisine-filter">
                <FaFilter />
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                  {availableCuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="search-results">
              {filteredFoodItems.map((food) => (
                <div
                  key={food.id}
                  className="food-search-item"
                  onClick={() => handleAddFood(food)}
                >
                  <div className="food-search-image">
                    <img src={food.image} alt={food.name} />
                  </div>
                  <div className="food-search-info">
                    <h4>{food.name}</h4>
                    <p>{food.description}</p>
                    <div className="food-search-macros">
                      <span>{food.calories} cal</span>
                      <span>P: {food.protein}g</span>
                      <span>C: {food.carbs}g</span>
                      <span>F: {food.fats}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="food-items">
          {mealPlan[selectedDay]?.[selectedMeal]?.map((item, index) => (
            <div key={index} className="food-item-card">
              <div className="food-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="food-info">
                <h4>{item.name}</h4>
                <div className="food-macros">
                  <span>
                    {Math.round((item.calories * item.quantity) / 100)} cal
                  </span>
                  <span>
                    P: {((item.protein * item.quantity) / 100).toFixed(1)}g
                  </span>
                  <span>
                    C: {((item.carbs * item.quantity) / 100).toFixed(1)}g
                  </span>
                  <span>
                    F: {((item.fats * item.quantity) / 100).toFixed(1)}g
                  </span>
                </div>
              </div>
              <div className="food-controls">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      selectedDay,
                      selectedMeal,
                      index,
                      parseInt(e.target.value)
                    )
                  }
                  className="quantity-slider"
                />
                <span className="quantity-value">{item.quantity}g</span>
                <button
                  className="remove-btn"
                  onClick={() =>
                    handleRemoveFood(selectedDay, selectedMeal, index)
                  }
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="meal-summary">
          <h4>Meal Summary</h4>
          <div className="summary-macros">
            {mealPlan[selectedDay] && (
              <>
                <div className="macro-item">
                  <span>Calories:</span>
                  <span>
                    {calculateMealMacros(
                      mealPlan[selectedDay][selectedMeal] || []
                    ).calories.toFixed(0)}{' '}
                    cal
                  </span>
                </div>
                <div className="macro-item">
                  <span>Protein:</span>
                  <span>
                    {calculateMealMacros(
                      mealPlan[selectedDay][selectedMeal] || []
                    ).protein.toFixed(1)}
                    g
                  </span>
                </div>
                <div className="macro-item">
                  <span>Carbs:</span>
                  <span>
                    {calculateMealMacros(
                      mealPlan[selectedDay][selectedMeal] || []
                    ).carbs.toFixed(1)}
                    g
                  </span>
                </div>
                <div className="macro-item">
                  <span>Fats:</span>
                  <span>
                    {calculateMealMacros(
                      mealPlan[selectedDay][selectedMeal] || []
                    ).fats.toFixed(1)}
                    g
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomMealPlan;
