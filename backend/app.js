//Const modules
const express = require('express');
const app = express();
const path = require ('path');
const mongoose = require('mongoose');
const dbUri = process.env.MONGODB_DAT;
const cors = require('cors');

//Middleware
// Ou body parser ==> same
app.use (express.json());
app.use(cors());


//Routes
const bookRoute = require ('./routes/book-routes');
const userRoutes = require ('./routes/user-routes');

//MongoDB


mongoose.connect(dbUri)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


//Routeurs
app.use('/api/book', bookRoute)
app.use('/api/auth', userRoutes)

    // Faire un champ tableau notes w/ : un tableau a 2 entrées avec userId + note qu'il a mise 
    // (stock différentes notes pr 1 mm livre + sur que la pers ne vote pas 2x)


module.exports = app;
