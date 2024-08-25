const mongoose = require ('mongoose')

//Schema des conditions pour donner une rate
const ratingSchema = mongoose.Schema ({
    userId:{ type: String, required: true},
    grade: { type: Number, required: true, min: 1 max:5}
})

//Schema du formulaire du book
const booksSchema = mongoose.Schema({
    userId:{ type: String, required: true},
    title: { type: String, required: true},
    author: { type: String, required: true},
    imageUrl:{ type: String, required: true},
    year: { type: Number, required: true},
    genre: { type: String, required: true},
    rating: [ratingSchema],
    averageRating: { type : Number}

});

module.exports = mongoose.model('Books', booksSchema);