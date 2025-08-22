let axios = require('axios');
const express = require('express');
require('dotenv').config();




const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

const SPOONACULAR_BASE_URL = process.env.SPOONACULAR_BASE_URL || BASE_URL;

const searchByIngredient = async (req, res) => {
    try {
        const { ingredients } = req.body;



        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ message: 'Ingredient query parameter is required' });
        }

        console.log("API Key:", process.env.SPOONACULAR_API_KEY);
        console.log("Base URL:", process.env.SPOONACULAR_BASE_URL);
        console.log("Full URL:", `${process.env.SPOONACULAR_BASE_URL}/recipes/findByIngredients`);

        // Convert ingredient to a comma-separated string if it's an array
        const ingredientString = Array.isArray(ingredients) ? ingredients.join(',') : ingredients;

        // Fetch recipes containing the specified ingredient
        const findRes = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/findByIngredients`, {
            params: {
                ingredients: ingredientString,
                number: 1, // Limit to 1 recipes
                apiKey: SPOONACULAR_API_KEY
            }


        })
       

        const recipe = findRes.data[0];

        if (!recipe) return res.status(404).json({ message: 'No recipe found' });

        // Step 2: Get more details
        const detailsRes = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${recipe.id}/information`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
            },
        });

        const details = detailsRes.data;

        // 🧾 Final formatted object
        const formatted = {
            id: details.id,
            title: details.title,
            image: details.image,
            summary: details.summary,
            readyInMinutes: details.readyInMinutes,
            servings: details.servings,
            instructions: details.instructions,
            sourceUrl: details.sourceUrl,
            ingredientsUsed: recipe.usedIngredients.map(i => i.name),
            ingredientsMissing: recipe.missedIngredients.map(i => i.name),
        };

        res.json(formatted);

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
        console.error('Error fetching recipes:', err.message);

    }
};

module.exports = { searchByIngredient };
