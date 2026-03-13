import React, { createContext, useState, useContext, useEffect } from "react";
import { getFavorites } from "../services/dashboardService";

export const FavoritesContext = createContext();

// Keep as named export
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

// Main provider component
function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getFavorites();
      setFavorites(response.data.favorites || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to fetch favorites");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []); // Initial fetch

  // Provide fetchFavorites in context
  return (
    <FavoritesContext.Provider
      value={{ favorites, setFavorites, loading, error, fetchFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Keep FavoritesProvider as named export
export { FavoritesProvider };
