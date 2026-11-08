const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
   coverImage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  categoryName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories'

  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
     enum:[1,2,3,3,4,5]

  },
  publishYear: {
    type: Number,
  },

  Status: {
    type: String,
    enum:['Borrowed','Coming Soon','Available']

  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true });

const Books = mongoose.model("Books", booksSchema);

module.exports = Books;
