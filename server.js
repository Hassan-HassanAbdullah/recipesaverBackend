let express = require('express');
let mongoose = require('mongoose');
require('dotenv').config();
let axios = require('axios');
const cors = require('cors');
// const Routes = require('./routes/Routes');


const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const saveRoutes = require('./routes/saveRecipeRoutes');


let app = express();


// Middleware
app.use(cors());
app.use(express.json());

// // Routes
// app.use('/api/auth', Routes);
// app.use('/api/recipes', Routes); // Assuming you want to use the same routes for recipes
// // app.use('/api/genrateRecipes', Routes); // Assuming you want to use the same routes for recipes


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api', saveRoutes);



// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
        console.log('Server is running on http://localhost:'+ process.env.PORT);
    })

}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});