const Book = require('../models/Book-models');

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
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
  // Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
  // .then(() => res.status(200).json ({ message : 'Livre modifié'}))
  // .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé' }))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  console.log("getAllBooks called");
  Book.find()
    .then(books => {
      console.log("Books found:", books);
      res.status(200).json(books);
    })
    .catch(error => {
      console.log("Error fetching books:", error);
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

      book.ratings.push({ userId, grade: rating });

      const totalRatings = book.ratings.length;
      const allGrades = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
      const averageRating = allGrades / totalRatings;

      book.averageRating = averageRating;

      console.log('auteur:', book.author);
      console.log('note moyenne :', book.averageRating);

      book.save()
        .then(() => res.status(200).json({ message: 'Votre évaluation a été ajoutée avec succès!' }))
        .catch(error => res.status(400).json({ error: 'Une erreur a été rencontrée sur votre évaluation' }));
    })
    .catch(error => res.status(400).json({ error: 'Nous avons rencontré un problème lors de la récupération du livre.' }));
};



//si ok, récupérer (vérifier) si la personne a déja noté le livre ou pas car pas censé etre le K
//si c'est pas le cas, vérifier (fouiller ds le livre ds le tableau ratings s'il y a l'id de l'user, si oui, il
//a déja noté donc erreur)
//si tout ok, remplir le tableau (push) id user et note