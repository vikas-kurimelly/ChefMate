import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import "../../styles/MyRecipes.css";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("/kitchen-recipes/my-recipes");
      setRecipes(response.data);
    } catch (err) {
      setError("Failed to fetch recipes");
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, recipeId) => {
    e.stopPropagation(); // Prevent expanding the card when clicking delete
    try {
      await axios.delete(`/kitchen-recipes/${recipeId}`);
      setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
      toast.success("Recipe deleted successfully");
      if (expandedRecipeId === recipeId) {
        setExpandedRecipeId(null);
      }
    } catch (err) {
      toast.error("Failed to delete recipe");
      console.error("Error deleting recipe:", err);
    }
  };

  if (loading) return <div className="loading-text">Loading your recipes...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="my-recipes-container p-4">
      <h1 className="text-2xl font-bold mb-6">My Kitchen Recipes</h1>
      {recipes.length === 0 ? (
        <p className="text-gray-600">
          No recipes yet. Try generating some in "What's in My Kitchen"!
        </p>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className={`recipe-card ${expandedRecipeId === recipe._id ? "expanded" : ""}`}
              onClick={() =>
                setExpandedRecipeId(
                  expandedRecipeId === recipe._id ? null : recipe._id
                )
              }
            >
              <div className="recipe-card-content">
                <div className="flex justify-between items-center w-full">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  <button
                    onClick={(e) => handleDelete(e, recipe._id)}
                    className="delete-btn"
                    title="Delete Recipe"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="recipe-time">
                  <Clock size={16} />
                  <span>{recipe.prepTime + recipe.cookTime} mins</span>
                </div>
              </div>

              {expandedRecipeId === recipe._id && (
                <div className="recipe-details">
                  <div className="recipe-meta">
                    <div className="meta-item">
                      <strong>Cuisine:</strong> {recipe.cuisine}
                    </div>
                    <div className="meta-item">
                      <strong>Difficulty:</strong> {recipe.difficulty}
                    </div>
                    <div className="meta-item">
                      <strong>Prep:</strong> {recipe.prepTime} mins
                    </div>
                    <div className="meta-item">
                      <strong>Cook:</strong> {recipe.cookTime} mins
                    </div>
                  </div>

                  <div className="recipe-ingredients">
                    <h4>Ingredients</h4>
                    <ul>
                      {recipe.ingredients?.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="recipe-instructions">
                    <h4>Instructions</h4>
                    <ol>
                      {recipe.instructions?.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {recipe.nutrition && (
                    <div className="nutrition-info">
                      <h4>Nutrition Information</h4>
                      <div className="nutrition-grid">
                        <div className="nutrition-item">
                          <span>Calories</span>
                          <strong>{recipe.nutrition.calories}kcal</strong>
                        </div>
                        <div className="nutrition-item">
                          <span>Protein</span>
                          <strong>{recipe.nutrition.protein}g</strong>
                        </div>
                        <div className="nutrition-item">
                          <span>Fat</span>
                          <strong>{recipe.nutrition.fat}g</strong>
                        </div>
                        <div className="nutrition-item">
                          <span>Carbs</span>
                          <strong>{recipe.nutrition.carbs}g</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
