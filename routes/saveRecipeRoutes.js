const express = require('express');
const router = express.Router();
const { saveRecipe, getSavedRecipes } = require('../controllers/SaveRecipes');
const authenticateUser = require('../Middleware/auth');

router.post('/save-recipe', authenticateUser, saveRecipe);
router.get('/get-save-recipe', authenticateUser, getSavedRecipes);

module.exports = router;
