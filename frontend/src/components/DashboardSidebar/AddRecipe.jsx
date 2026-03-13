import React, { useState } from "react";
import axiosInstance from "../../services/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "../../styles/AddRecipe.css";
const AddRecipe = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [""],
    instructions: [""],
    cuisine: "",
    difficulty: "Easy",
    category: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    dietType: "",
    mealType: "",
    nutrition: {
      calories: "",
      protein: "",
      fat: "",
      carbs: "",
    },
  });

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredientField = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, ""],
    });
  };

  const removeIngredientField = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const addInstructionField = () => {
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, ""],
    });
  };

  const removeInstructionField = (index) => {
    const newInstructions = recipe.instructions.filter((_, i) => i !== index);
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const handleNutritionChange = (field, value) => {
    setRecipe({
      ...recipe,
      nutrition: { ...recipe.nutrition, [field]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("kitchen-recipes", {
        ...recipe,
        ingredients: recipe.ingredients.filter(Boolean),
        instructions: recipe.instructions.filter(Boolean),
        prepTime: parseInt(recipe.prepTime),
        cookTime: parseInt(recipe.cookTime),
        servings: parseInt(recipe.servings),
        nutrition: {
          calories: parseInt(recipe.nutrition.calories),
          protein: parseInt(recipe.nutrition.protein),
          fat: parseInt(recipe.nutrition.fat),
          carbs: parseInt(recipe.nutrition.carbs),
        },
      });

      alert("Recipe added successfully!"); // Navigate to the recipe details page
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add recipe");
    }
  };

  return (
    <div className="recipe-container">
      <h2 className="add-recipe-title">Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={recipe.title}
              onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Cuisine</label>
            <input
              type="text"
              value={recipe.cuisine}
              onChange={(e) =>
                setRecipe({ ...recipe, cuisine: e.target.value })
              }
              className="form-input"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="form-group">
          <label className="form-label">Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-group">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="form-input"
                placeholder="Enter ingredient"
                required
              />
              <button
                type="button"
                onClick={() => removeIngredientField(index)}
                className="btn btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredientField}
            className="btn btn-add"
          >
            Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div className="form-group">
          <label className="form-label">Instructions</label>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="ingredient-group">
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className="form-input textarea"
                placeholder={`Step ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => removeInstructionField(index)}
                className="btn btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInstructionField}
            className="btn btn-add"
          >
            Add Step
          </button>
        </div>

        {/* Recipe Details */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <select
              value={recipe.difficulty}
              onChange={(e) =>
                setRecipe({ ...recipe, difficulty: e.target.value })
              }
              className="form-input"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              value={recipe.category}
              onChange={(e) =>
                setRecipe({ ...recipe, category: e.target.value })
              }
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Prep Time (minutes)</label>
            <input
              type="number"
              value={recipe.prepTime}
              onChange={(e) =>
                setRecipe({ ...recipe, prepTime: e.target.value })
              }
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Cook Time (minutes)</label>
            <input
              type="number"
              value={recipe.cookTime}
              onChange={(e) =>
                setRecipe({ ...recipe, cookTime: e.target.value })
              }
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Nutrition Information */}
        <div className="form-group">
          <h3 className="recipe-title">Nutrition Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Calories</label>
              <input
                type="number"
                value={recipe.nutrition.calories}
                onChange={(e) =>
                  handleNutritionChange("calories", e.target.value)
                }
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input
                type="number"
                value={recipe.nutrition.protein}
                onChange={(e) =>
                  handleNutritionChange("protein", e.target.value)
                }
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fat (g)</label>
              <input
                type="number"
                value={recipe.nutrition.fat}
                onChange={(e) => handleNutritionChange("fat", e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Carbs (g)</label>
              <input
                type="number"
                value={recipe.nutrition.carbs}
                onChange={(e) => handleNutritionChange("carbs", e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-submit">
          Add Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
