const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecipe = async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ message: 'Ingredients are required' });
        }

        const ingredientString = ingredients.join(', ');

        const prompt = `
You are a JSON generator AI.

Task:
Generate a Pakistani recipe based on the following ingredients:
${ingredientString}

Rules:
1. Strictly return only a JSON object — no markdown, no comments, no explanation.
2. Do not include triple backticks  or any formatting.
        3. The output must start with '{' and end with '}'.
4. Avoid extra whitespace or newline at the beginning or end.
5. Keys must be in double quotes.

JSON Structure:
        {
            "name"= "string",
                "description": "string",
                    "ingredients": ["string", ...],
                        "steps": ["string", ...],
                            "servings": "string",
                                "estimatedCookingTime": "string",
                                    "cuisine": "Pakistani",
                                        "timeToPrepare": "string",
                                            "timeToCook": "string",
                                                "totalTime": "string"
        }
        `;




        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        // ✅ Remove markdown formatting like ```json ... ```
        responseText = text.replace(/```json|```/g, '').trim();
        console.log("🔎 Gemini raw response:\n", responseText);


        let recipe;
        try {
            recipe = JSON.parse(text);
        } catch (parseError) {
            return res.status(500).json({ message: 'Invalid JSON from Gemini', raw: text });
        }

        res.status(200).json({ recipe });

    } catch (error) {
        console.error('Error generating recipe:', error);
        res.status(500).json({ message: 'Error generating recipe' });
    }
};

module.exports = { generateRecipe };
