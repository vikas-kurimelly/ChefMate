const KitchenRecipe = require("../models/KitchenRecipe");

// Create a new kitchen recipe
exports.createKitchenRecipe = async (req, res) => {
  try {
    const recipe = new KitchenRecipe({
      ...req.body,
      creator: req.user.id
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error creating recipe", error: error.message });
  }
};

// Get all public kitchen recipes
exports.getAllKitchenRecipes = async (req, res) => {
  try {
    const recipes = await KitchenRecipe.find({ isPublic: true })
      .populate("creator", "username")
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes", error: error.message });
  }
};

// Get user's kitchen recipes
exports.getUserKitchenRecipes = async (req, res) => {
  try {
    const recipes = await KitchenRecipe.find({ creator: req.user.id })
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user recipes", error: error.message });
  }
};

// Update a kitchen recipe
exports.updateKitchenRecipe = async (req, res) => {
  try {
    const recipe = await KitchenRecipe.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
      req.body,
      { new: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found or unauthorized" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error updating recipe", error: error.message });
  }
};

// Delete a kitchen recipe
exports.deleteKitchenRecipe = async (req, res) => {
  try {
    const recipe = await KitchenRecipe.findOneAndDelete({
      _id: req.params.id,
      creator: req.user.id
    });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found or unauthorized" });
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe", error: error.message });
  }
};

// Add rating to a recipe
exports.addRating = async (req, res) => {
  try {
    const { score, comment } = req.body;
    const recipe = await KitchenRecipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if user has already rated
    const existingRating = recipe.ratings.find(
      rating => rating.user.toString() === req.user.id
    );

    if (existingRating) {
      existingRating.score = score;
      existingRating.comment = comment;
    } else {
      recipe.ratings.push({ user: req.user.id, score, comment });
    }

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error adding rating", error: error.message });
  }
};