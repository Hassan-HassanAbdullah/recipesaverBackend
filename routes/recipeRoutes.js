const express = require('express');
const router = express.Router();

const { searchByIngredient } = require('../controlers/recipyControler');
const  {generateRecipe}  = require ('../controlers/genrateRecipeControler');

router.post('/searchByIngredient', searchByIngredient);
router.post('/generate-recipe', generateRecipe);

module.exports = router;
