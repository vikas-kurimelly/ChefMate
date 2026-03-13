import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios";
import { toast } from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import "../styles/MainContent.css";

const Recipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { favorites, setFavorites } = useFavorites();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axiosInstance.get(`/kitchen-recipes/${id}`);
        setRecipe(response.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        toast.error("Failed to fetch recipe details");
        navigate("/my-recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleToggleFavorite = async () => {
    try {
      if (favorites.some((fav) => fav._id === recipe._id)) {
        await axiosInstance.delete(`/favorites/${recipe._id}`);
        setFavorites(favorites.filter((fav) => fav._id !== recipe._id));
        toast.success("Removed from favorites");
      } else {
        await axiosInstance.post(`/favorites/${recipe._id}`);
        setFavorites([...favorites, recipe]);
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
      toast.error("Failed to update favorites");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading recipe details...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="no-recipes">
        <p>Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="recipe-details-view">
      <div className="recipe-details-header">
        <button
          className="btn btn-back"
          onClick={() => navigate("/my-recipes")}
        >
          ← Back to recipes
        </button>
        <div className="recipe-action-buttons">
          <button
            className={`btn btn-favorite ${
              favorites.some((fav) => fav._id === recipe._id) ? "active" : ""
            }`}
            onClick={handleToggleFavorite}
          >
            {favorites.some((fav) => fav._id === recipe._id) ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
            {favorites.some((fav) => fav._id === recipe._id)
              ? "Remove from Favorites"
              : "Add to Favorites"}
          </button>
        </div>
      </div>

      <h2 className="recipe-details-title">{recipe.title}</h2>

      <div className="recipe-details-content">
        <div className="recipe-info-section">
          <div className="recipe-meta">
            <div className="meta-item">
              <strong>Cuisine:</strong> {recipe.cuisine}
            </div>
            <div className="meta-item">
              <strong>Category:</strong> {recipe.category}
            </div>
            <div className="meta-item">
              <strong>Diet Type:</strong> {recipe.dietType}
            </div>
            <div className="meta-item">
              <strong>Meal Type:</strong> {recipe.mealType}
            </div>
            <div className="meta-item">
              <strong>Prep Time:</strong> {recipe.prepTime} mins
            </div>
            <div className="meta-item">
              <strong>Cook Time:</strong> {recipe.cookTime} mins
            </div>
            <div className="meta-item">
              <strong>Servings:</strong> {recipe.servings}
            </div>
            <div className="meta-item">
              <strong>Difficulty:</strong> {recipe.difficulty}
            </div>
          </div>

          {recipe.nutrition && (
            <div className="nutrition-info">
              <h3>Nutrition Information</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span>Calories</span>
                  <strong>{recipe.nutrition.calories} kcal</strong>
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

        <div className="recipe-ingredients">
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients?.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>

        <div className="recipe-instructions">
          <h3>Instructions</h3>
          <ol>
            {recipe.instructions?.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
