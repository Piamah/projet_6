const express = require('express');
const app = express();
const path = require ('path');

// Ou body parser ==> same
app.use(express.json());

const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());


const bookRoute = require ('./routes/book-routes');
const userRoutes = require ('./routes/user-routes');

mongoose.connect('mongodb+srv://piama:X9P7AQeGHHrp90ue@cluster0.xu9x4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/api/book', bookRoute)
app.use('/api/auth', userRoutes)
    // Faire un champ tableau notes w/ : un tableau a 2 entrées avec userId + note qu'il a mise 
    // (stock différentes notes pr 1 mm livre + sur que la pers ne vote pas 2x)


module.exports = app;
