import axios from "./axios";

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  return axios.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getFavorites = async () => {
  return axios.get("/favorites");
};

export const addToFavorites = async (recipeId) => {
  return axios.post(`/favorites/${recipeId}`);
};

export const removeFromFavorites = async (recipeId) => {
  return axios.delete(`/favorites/${recipeId}`);
};

export const getRecommendations = async () => {
  return axios.get("/recommendations");
};

export const getMealPlans = async () => {
  return axios.get("/meal-plans");
};

export const getShoppingList = async () => {
  return axios.get("/shopping-list");
};

export const addToShoppingList = async (recipeData) => {
  return axios.post("/shopping-list/add", recipeData);
};

export const removeFromShoppingList = async (itemId) => {
  return axios.delete(`/shopping-list/${itemId}`);
};

export const removeRecipeFromShoppingList = async (recipeId) => {
  return axios.delete(`/shopping-list/recipe/${recipeId}`);
};

export const updateShoppingListItem = async (itemId, updates) => {
  return axios.put(`/shopping-list/${itemId}`, updates);
};
