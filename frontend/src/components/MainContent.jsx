import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import { Clock, ChevronDown, ShoppingBag } from "lucide-react";
import { FaHeart, FaRegHeart, FaSearch, FaFilter } from "react-icons/fa";
import {
  addToFavorites,
  removeFromFavorites,
  addToShoppingList,
} from "../services/dashboardService";
import "../styles/MainContent.css";
import { useFavorites } from "../context/FavoritesContext";
import { toast } from "react-hot-toast";

// Recipe Card
const RecipeCard = ({ recipe, isFavorite, onToggleFavorite, onClick }) => (
  <div className="recipe-card" onClick={() => onClick(recipe)}>
    <div className="recipe-image-container">
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <button
        className={`favorite-btn ${isFavorite ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(recipe);
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
    <div className="recipe-details">
      <h3 className="recipe-title">{recipe.title}</h3>
      <div className="recipe-tags">
        <span className="recipe-cuisine">{recipe.cuisine}</span>
        <span className="recipe-category">{recipe.category}</span>
      </div>
      <p className="recipe-time">
        <Clock size={16} />
        <span>Prep: {recipe.prepTime} mins</span> |
        <span>Cook: {recipe.cookTime} mins</span>
      </p>
    </div>
  </div>
);

// Recipe Details View
const RecipeDetails = ({ recipe, onBack, onFavorite, isFavorite }) => {
  const [isAddingToList, setIsAddingToList] = useState(false);

  const handleAddToShoppingList = async () => {
    try {
      setIsAddingToList(true);
      console.log("Adding to shopping list:", {
        recipeId: recipe._id,
        recipeName: recipe.title,
        ingredients: recipe.ingredients,
      });

      const response = await addToShoppingList({
        recipeId: recipe._id,
        recipeName: recipe.title,
        ingredients: recipe.ingredients,
      });

      console.log("Shopping list response:", response.data);
      toast.success("Added to shopping list!");
    } catch (error) {
      console.error("Error adding to shopping list:", error);
      // Check for specific error types and provide better error messages
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          error.response.data?.error || "Server error. Please try again.";
        toast.error(`Failed: ${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("Failed to add to shopping list. Please try again.");
      }
    } finally {
      setIsAddingToList(false);
    }
  };

  return (
    <div className="recipe-details-view">
      <div className="recipe-details-header">
        <button className="btn btn-back" onClick={onBack}>
          ← Back to recipes
        </button>
        <div className="recipe-action-buttons">
          <button
            className={`btn btn-favorite ${isFavorite ? "active" : ""}`}
            onClick={() => onFavorite(recipe)}
          >
            <FaHeart />
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          <button
            className="btn btn-shopping-list"
            onClick={handleAddToShoppingList}
            disabled={isAddingToList}
          >
            <ShoppingBag size={16} />
            {isAddingToList ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      <h2 className="recipe-details-title">{recipe.title}</h2>

      <div className="recipe-details-image-container">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-details-image"
        />
      </div>

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
              <strong>Region:</strong> {recipe.mainCourseRegion}
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

          {recipe.description && (
            <div className="recipe-description">
              <h3>Description</h3>
              <p>{recipe.description}</p>
            </div>
          )}

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

const LoadingSkeleton = () => (
  <div className="recipe-card skeleton">
    <div className="recipe-image skeleton-image" />
    <div className="recipe-details">
      <div className="skeleton-title" />
      <div className="skeleton-tags">
        <div className="skeleton-tag" />
        <div className="skeleton-tag" />
      </div>
      <div className="skeleton-time" />
    </div>
  </div>
);

const MainContent = ({ searchQuery, showOnlyFavorites = false }) => {
  const { favorites, setFavorites } = useFavorites(); // Use context instead of props
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  // Filter categories
  const filterCategories = [
    { label: "All", value: "" },
    {
      label: "Diet Type",
      options: [
        { label: "Veg", value: "category:veg" },
        { label: "Non-veg", value: "category:non-veg" },
        { label: "Balanced Diet", value: "dietType:balanced" },
        { label: "Low Diet", value: "dietType:low" },
        { label: "High Diet", value: "dietType:high" },
      ],
    },
    {
      label: "Region",
      options: [
        { label: "South-Indian", value: "mainCourseRegion:South" },
        { label: "North-Indian", value: "mainCourseRegion:North" },
        { label: "East-Indian", value: "mainCourseRegion:East" },
        { label: "West-Indian", value: "mainCourseRegion:West" },
      ],
    },
    {
      label: "Meal Type",
      options: [
        { label: "Breakfast/Tiffin", value: "mealType:breakfast" },
        { label: "Lunch", value: "mealType:lunch" },
        { label: "Dinner", value: "mealType:dinner" },
      ],
    },
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get("/recipes");
        setRecipes(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    // Update local search query when prop changes
    setLocalSearchQuery(searchQuery || "");
  }, [searchQuery]);

  // Remove this useEffect
  // useEffect(() => {
  //     localStorage.setItem("favorites", JSON.stringify(favorites));
  // }, [favorites]);

  const handleToggleFavorite = async (recipe) => {
    try {
      const exists = favorites.some((fav) => fav._id === recipe._id);
      if (exists) {
        await removeFromFavorites(recipe._id);
        setFavorites((prev) => prev.filter((fav) => fav._id !== recipe._id));
      } else {
        await addToFavorites(recipe._id);
        setFavorites((prev) => [...prev, recipe]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      if (error.response?.status === 400) {
        // Handle specific 400 error
        console.error("Bad request:", error.response.data.message);
      } else if (error.response?.status === 401) {
        // Handle authentication error
        console.error("Authentication failed");
      }
      // Optionally show an error message to the user
    }
  };

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    setShowFilterDropdown(false);
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const displayedRecipes = showOnlyFavorites
    ? favorites
    : recipes.filter((recipe) => {
        // Text search filter
        const searchLower = localSearchQuery.toLowerCase();
        const matchesSearch =
          searchLower === "" ||
          recipe.title.toLowerCase().includes(searchLower) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchLower)
          ) ||
          recipe.cuisine?.toLowerCase().includes(searchLower) ||
          recipe.category?.toLowerCase().includes(searchLower);

        // Category filter
        let matchesFilter = true;
        if (selectedFilter) {
          const [filterType, filterValue] = selectedFilter.split(":");

          switch (filterType) {
            case "category":
              matchesFilter = recipe.category
                ?.toLowerCase()
                .includes(filterValue.toLowerCase());
              break;
            case "dietType":
              matchesFilter = recipe.dietType
                ?.toLowerCase()
                .includes(filterValue.toLowerCase());
              break;
            case "mainCourseRegion":
              matchesFilter = recipe.mainCourseRegion
                ?.toLowerCase()
                .includes(filterValue.toLowerCase());
              break;
            case "mealType":
              matchesFilter = recipe.mealType
                ?.toLowerCase()
                .includes(filterValue.toLowerCase());
              break;
            default:
              matchesFilter = true;
          }
        }

        return matchesSearch && matchesFilter;
      });

  if (loading) {
    return (
      <div className="main-content">
        {[...Array(6)].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Show details if a recipe is selected
  if (selectedRecipe) {
    return (
      <div className="main-content">
        <RecipeDetails
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipe(null)}
          onFavorite={handleToggleFavorite}
          isFavorite={favorites.some((fav) => fav._id === selectedRecipe._id)}
        />
      </div>
    );
  }

  // Otherwise, show list with search bar and filter dropdown
  return (
    <>
      <div className="search-container">
        <div className="search-filters">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, cuisines..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="filter-dropdown-container">
            <button
              className="filter-button"
              onClick={toggleFilterDropdown}
              aria-expanded={showFilterDropdown}
              aria-haspopup="true"
            >
              <FaFilter />
              <span>
                {selectedFilter
                  ? filterCategories
                      .flatMap((cat) => cat.options || [])
                      .find((opt) => opt.value === selectedFilter)?.label ||
                    "Filter"
                  : "Filter"}
              </span>
              <ChevronDown size={16} />
            </button>

            {showFilterDropdown && (
              <div className="filter-dropdown">
                {filterCategories.map((category) => (
                  <div key={category.label} className="filter-category">
                    {category.label !== "All" ? (
                      <div className="filter-category-label">
                        {category.label}
                      </div>
                    ) : (
                      <div
                        className={`filter-option ${
                          selectedFilter === "" ? "active" : ""
                        }`}
                        onClick={() => handleFilterSelect("")}
                      >
                        All Recipes
                      </div>
                    )}

                    {category.options?.map((option) => (
                      <div
                        key={option.value}
                        className={`filter-option ${
                          selectedFilter === option.value ? "active" : ""
                        }`}
                        onClick={() => handleFilterSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        {displayedRecipes.length > 0 ? (
          displayedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              isFavorite={favorites.some((fav) => fav._id === recipe._id)}
              onToggleFavorite={handleToggleFavorite}
              onClick={setSelectedRecipe}
            />
          ))
        ) : (
          <div className="no-recipes">
            No recipes found matching your criteria!
          </div>
        )}
      </div>
    </>
  );
};

export default MainContent;
