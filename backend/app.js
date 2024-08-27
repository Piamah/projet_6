//Const modules
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config()

//Middleware
// Ou body parser ==> same
app.use(express.json());
app.use(cors());


//Routes
const bookRoute = require('./routes/book-routes');
const userRoutes = require('./routes/user-routes');

//MongoDB
mongoose.connect(process.env.MONGO)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Routeurs
app.use('/api/books', bookRoute);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))

    // Faire un champ tableau notes w/ : un tableau a 2 entrées avec userId + note qu'il a mise 
    // (stock différentes notes pr 1 mm livre + sur que la pers ne vote pas 2x)


module.exports = app;
