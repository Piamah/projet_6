const Book = require('../models/Book-models');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré' }))
    .catch(error => res.status(400).json({ error }));
};


exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        if (req.file) {
          const oldImage = book.imageUrl.split("/images/")[1];
          fs.unlink(`images/${oldImage}`, (err) => {
            if (err) console.error("Erreur lors de la suppression de l'image:", err);
          });
        }
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: "Vous n'avez pas l'autorisation" });
      }
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) console.error("Erreur lors de la suppression de l'image:", err);
      });
      // console.log(filename);

      Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Livre supprimé !" }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};


exports.bookArray = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
}

exports.rateBook = (req, res, next) => {
  const { rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'La note doit être comprise entre 1 et 5' });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: 'Le livre que vous demandez est introuvable' });
      }

      const userId = req.auth.userId;
      const alreadyRated = book.ratings.some(note => note.userId === userId);

      if (alreadyRated) {
        return res.status(400).json({ error: 'Vous avez déjà noté ce livre' });
      }

      book.ratings.push({ userId: userId, grade: rating });

      const totalRatings = book.ratings.length;
      const allGrades = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
      let averageRating = allGrades / totalRatings;

      averageRating = Math.round(averageRating * 10) / 10;
      // averageRating = parseFloast(averageRating.toFixed(1));

      book.averageRating = averageRating;

      console.log('auteur:', book.author);
      console.log('note moyenne :', book.averageRating);
      console.log(book._id);
      console.log(book.id);

      book.save()
        .then(() => res.status(200).json(book))
        .catch(error => res.status(400).json({ error: 'Une erreur a été rencontrée sur votre évaluation' }));
    })
    .catch(error => res.status(400).json({ error: 'Nous avons rencontré un problème lors de la récupération du livre.' }));
};

