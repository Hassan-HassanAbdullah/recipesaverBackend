const express = require('express');
const router = express.Router();
const { searchByIngredient } = require('../controllers/recipyControler');
const { generateRecipe } = require('../controllers/genrateRecipeControler');

router.post('/searchByIngredient', searchByIngredient);
router.post('/generate-recipe', generateRecipe);

module.exports = router;
