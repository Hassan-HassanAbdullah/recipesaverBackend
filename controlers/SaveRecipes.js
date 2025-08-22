// routes/recipes.js

const express = require('express');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const axios = require('axios');

const crypto = require('crypto')


function genrateReipeHash(recipe){
  const str= recipe.name+recipe.ingredients.join(",")+recipe.steps.join(",");
  return crypto.createHash("sha256").update(str).digest("hex");
}



// ✅ POST /api/recipes/save
const saveRecipe =  async (req, res) => {
  try {
    const userId = req.user.id; // JWT middleware se milta hai
    const { source, recipe } = req.body;

    let savedRecipe;
    let recipeHash = genrateReipeHash(recipe)

    // 👇 Gemini ka data save karna
    if (source === 'gemini') {
      let exists = await Recipe.findOne({recipeHash})
      if(exists){
        savedRecipe = exists
      }
      else {
        savedRecipe = new Recipe({
        ...recipe, // recipe object directly spread kiya
        recipeHash,
        source: 'gemini',
      });
      }
      await savedRecipe.save();
    }

    // 👇 Local recipes
    else if (source === 'local') {
      let exists = await Recipe.findOne(spoonacularId)
      if(exists){
        savedRecipe = recipe
      }
     
      
      await savedRecipe.save();
      // savedRecipe = new Recipe({
      //   name: '',
      //   description: '',
      //   ingredients: [],
      //   steps: [],
      //   servings: '',
      //   estimatedCookingTime: '',
      //   cuisine: '',
      //   timeToPrepare: '',
      //   timeToCook: '',
      //   totalTime: '',
      //   source: 'spoonacular',
      //   spoonacularId: spoonacularId,
      //   createdBy: userId
      // });
      // await savedRecipe.save();

      
    }



    const user = await User.findById(userId);
    const alreadySaved = user.savedRecipes.includes(savedRecipe._id);

    if(alreadySaved){
      //unsave
      user.savedRecipes.pull(savedRecipe._id);
      await user.save();
      return res.status(200).json({ message: 'Recipe UnSaved successfully!', id: savedRecipe._id , saved : false });
    }else{
    //  save
    user.savedRecipes.push(savedRecipe._id);
      await user.save();
      return res.status(200).json({ message: 'Recipe Saved successfully!', id: savedRecipe._id , saved : true });

    }

    
  } catch (err) {
    console.error('❌ Error saving recipe:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}




// Get save recipes

const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user.id; // Login user
    const user = await User.findById(userId);

    // Step 1: Get all saved recipe IDs
    const savedRecipeIds = user.savedRecipes;

    // Step 2: Get all recipe documents from Recipe table
    const allRecipes = await Recipe.find({ _id: { $in: savedRecipeIds } });

    // Step 3: Separate spoonacular and gemini recipes
    const geminiRecipes = allRecipes.filter(r => r.source === 'gemini');
    const spoonacularRecipes = allRecipes.filter(r => r.source === 'spoonacular');

    // Step 4: Fetch spoonacular recipe details from API
    const spoonacularResults = await Promise.all(
      spoonacularRecipes.map(async (r) => {
        try {
          const response = await axios.get(`${process.env.SPOONACULAR_BASE_URL}/recipes/${r.spoonacularId}/information`, {
            params: { apiKey: process.env.SPOONACULAR_API_KEY }
          });
          return response.data;
        } catch (err) {
          console.error(`Error fetching spoonacular recipe ${r.spoonacularId}`);
          return null;
        }
      })
    );

    // Remove nulls (failed requests)
    const validSpoonacularRecipes = spoonacularResults.filter(r => r !== null);

    // Step 5: Combine both types
    const combinedRecipes = [...geminiRecipes, ...validSpoonacularRecipes];

    res.status(200).json(combinedRecipes);

  } catch (err) {
    console.error('❌ Error getting saved recipes:', err.message);
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
};



module.exports = {saveRecipe, getSavedRecipes};
