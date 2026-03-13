import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import "../styles/Dashboard.css"; // Import the new CSS
import MainContent from "../components/MainContent"; // Import MainContent component
import Explore from "../components/DashboardSidebar/Explore";
import MyRecipes from "../components/DashboardSidebar/MyRecipes";
import AddRecipe from "../components/DashboardSidebar/AddRecipe";
import Favorites from "../components/DashboardSidebar/Favorites";
import WhatsInMyKitchen from "../components/DashboardSidebar/WhatsInMyKitchen";
import HealthyPlate from "../components/DashboardSidebar/HealthyPlate";
import ImageSearch from "../components/DashboardSidebar/ImageSearch";
import VoiceSearch from "../components/DashboardSidebar/VoiceSearch";
import AIAssistant from "../components/DashboardSidebar/AIAssistant";
import MealPlanner from "../components/DashboardSidebar/MealPlanner";
import MyMealPlans from "../components/DashboardSidebar/MyMealPlans";
import ShoppingList from "../components/DashboardSidebar/ShoppingList";
import CookingMode from "../components/DashboardSidebar/CookingMode";
import Preferences from "../components/DashboardSidebar/Preferences";
import Achievements from "../components/DashboardSidebar/Achievements";
import Notifications from "../components/DashboardSidebar/Notifications";
import Community from "../components/DashboardSidebar/Community";
import { useFavorites } from '../context/FavoritesContext';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("Explore");
  const { favorites, setFavorites } = useFavorites(); // Use context instead of local state
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    }

    // Check and apply theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [navigate]);

  // Conditional rendering based on selected menu
  const renderSelectedComponent = () => {
    switch (selectedMenu) {
      case "Explore":
        return (
          <MainContent
            searchQuery={searchQuery}
            favorites={favorites}
            setFavorites={setFavorites}
            showOnlyFavorites={false}
          />
        );
      case "Favorites":
        return (
          <MainContent
            searchQuery={searchQuery}
            favorites={favorites}
            setFavorites={setFavorites}
            showOnlyFavorites={true}
          />
        );
      case "My Recipes":
        return <MyRecipes />;
      case "Add Recipe":
        return <AddRecipe />;
      case "What’s in My Kitchen":
        return <WhatsInMyKitchen />;
      case "Healthy Plate":
        return <HealthyPlate />;
      case "Image Search":
        return <ImageSearch />;
      case "Voice Search":
        return <VoiceSearch />;
      case "AI Assistant":
        return <AIAssistant />;
      case "Meal Planner":
        return <MealPlanner />;
      case "My Meal Plans":
        return <MyMealPlans />;
      case "Shopping List":
        return <ShoppingList />;
      case "Cooking Mode":
        return <CookingMode />;
      case "Preferences":
        return <Preferences />;
      case "Achievements":
        return <Achievements />;
      case "Notifications":
        return <Notifications />;
      case "Community":
        return <Community />;
      default:
        return <Explore />; // Default to Explore if no match
    }
  };

  return (
    <div
      className={`dashboard-container ${
        !sidebarOpen ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Sidebar and Main Content Layout */}
      <div className="dashboard-layout">
        <DashboardSidebar
          isOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />

        <main className="dashboard-main-content">
          {/* Conditionally render the selected component */}
          {renderSelectedComponent()}
        </main>
      </div>
    </div>
  );
}
