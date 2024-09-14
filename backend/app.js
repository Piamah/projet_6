//Const modules
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

dotenv.config()

//Middleware
// Ou body parser ==> same
app.use(express.json());
app.use(cors());


//Routes
const bookRoute = require('./routes/book');
const userRoutes = require('./routes/user');

//MongoDB
mongoose.connect(process.env.MONGO)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Helmet
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))

//Routeurs
app.use('/api/books', bookRoute);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))


module.exports = app;
