const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const kitchenRecipeController = require("../controllers/kitchenRecipeController");

// Protect all routes
router.use(authMiddleware);

// Get all public kitchen recipes
router.get("/public", kitchenRecipeController.getAllKitchenRecipes);

// Get user's kitchen recipes
router.get("/my-recipes", kitchenRecipeController.getUserKitchenRecipes);

// Create a new kitchen recipe
router.post("/", kitchenRecipeController.createKitchenRecipe);

// Update a kitchen recipe
router.put("/:id", kitchenRecipeController.updateKitchenRecipe);

// Delete a kitchen recipe
router.delete("/:id", kitchenRecipeController.deleteKitchenRecipe);

// Add rating to a recipe
router.post("/:id/rate", kitchenRecipeController.addRating);

module.exports = router;