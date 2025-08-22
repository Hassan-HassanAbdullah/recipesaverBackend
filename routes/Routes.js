const express = require('express');
const router = express.Router();
const { register, login } = require('../controlers/authController');
const { searchByIngredient } = require('../controlers/recipyControler');
const  {generateRecipe}  = require ('../controlers/genrateRecipeControler');
const { saveRecipe, getSavedRecipes } = require('../controlers/SaveRecipes');

// 🔐 Middleware (JWT verify function) yahaan assume kiya gaya hai
const authenticateUser = require('../Middleware/auth');



// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/recipes/searchByIngredient
router.post('/searchByIngredient', searchByIngredient);

// POST /api/recipes/generate-recipe
router.post('/generate-recipe', generateRecipe);


router.post('/save-recipe', authenticateUser, saveRecipe);
router.get('/get-save-recipe', authenticateUser, getSavedRecipes);




module.exports = router;
