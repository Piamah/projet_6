const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/book-controllers')

  //Permet de modifier un book
  router.put('/:id', bookCtrl.modifyBook)
  //Permet de supprimer un book 
  router.delete('/:id', bookCtrl.deleteBook)
  // Permet de récupérer un book
  router.get('/:id', bookCtrl.getOneBook )
//Permet d'ajouter un book
router.post ('/', bookCtrl.createBook);
  //Permet de récup les books
  router.get('/',bookCtrl.getAllBooks);
  
  module.exports = router;