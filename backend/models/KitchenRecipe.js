const mongoose = require("mongoose");

const KitchenRecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: [String], required: true },
    cuisine: { type: String },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    category: { type: String },
    prepTime: { type: Number },
    cookTime: { type: Number },
    servings: { type: Number },
    dietType: { type: String },
    mealType: { type: String },
    nutrition: {
      calories: { type: Number },
      protein: { type: Number },
      fat: { type: Number },
      carbs: { type: Number },
    },
    availableIngredients: [{ type: String }],
    substitutions: [{
      original: { type: String },
      replacement: { type: String },
      notes: { type: String }
    }],
    notes: { type: String },
    isPublic: { type: Boolean, default: true },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        score: { type: Number, min: 1, max: 5 },
        comment: { type: String }
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("KitchenRecipe", KitchenRecipeSchema);