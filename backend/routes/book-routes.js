const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const bookCtrl = require('../controllers/book-controllers')

// //Permet de renvoyer un tableau de 3 livres ayant la meilleure note ***** 5
router.get('/bestrating', bookCtrl.bookArray);
//Permet de modifier un book ***** 7
router.put('/:id', auth, multer, bookCtrl.modifyBook);
//Permet de supprimer un book ***** 8
router.delete('/:id', auth, bookCtrl.deleteBook);
// Permet de récupérer un book ***** 4
router.get('/:id', bookCtrl.getOneBook );
//Permet d'ajouter un book ***** 6
router.post('/', auth, multer, bookCtrl.createBook);
//Permet de récup les books ***** 3
router.get('/', bookCtrl.getAllBooks);
// //Permet de donner une note à un bouquin? ***** 9
router.post('/:id/rating', auth, bookCtrl.rateBook)
  

module.exports = router;