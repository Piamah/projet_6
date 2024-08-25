const express = require('express');
const router = express.Router();

const Book = require('../models/Book-models')


//Permet d'ajouter un book
router.post ('/', (req, res, next) => {
    delete req.body._id
    const book = new Book ({
      ...req.body
    });
    book.save()
    .then(() => res.status(201).json ({ message: 'Livre enregistré'}))
    .catch(error => res.status(400).json({ error }));
  });
  
  //Permet de modifier un book
  router.put('/:id', (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json ({ message : 'Livre modifié'}))
    .catch(error => res.status(400).json({ error }));
  })
  
  //Permet de supprimer un book 
  router.delete('/:id', (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message : 'Livre supprimé'}))
    .catch()
  })
  
  // Permet de récupérer un book
  router.get('/:id', (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json (book))
    .catch(error => res.status(404).json({ error }));
  })
  
  //Permet de récup les books
  router.get('/api/books', (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json (books))
    .catch(error => res.status(400).json({ error }))
  });
  
  