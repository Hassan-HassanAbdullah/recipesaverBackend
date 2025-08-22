// models/Recipe.js

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: String,
  description: String,
  ingredients: [String],
  steps: [String],
  servings: String,
  estimatedCookingTime: String,
  cuisine: String,
  timeToPrepare: String,
  timeToCook: String,
  totalTime: String,
  source: {
    type: String, // "gemini" or "spoonacular"
    required: true
  },
  spoonacularId: String, // agar source spoonacular ho
  recipeHash: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default : Date.now
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);
