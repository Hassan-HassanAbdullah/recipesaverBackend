const express = require('express');
const router = express.Router();

const { saveRecipe, getSavedRecipes } = require('../controlers/SaveRecipes');
// 🔐 Middleware (JWT verify function) yahaan assume kiya gaya hai
const authenticateUser = require('../Middleware/auth');

router.post('/save-recipe', authenticateUser, saveRecipe);
router.get('/get-save-recipe', authenticateUser, getSavedRecipes);

module.exports = router;
