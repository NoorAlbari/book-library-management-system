const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
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

  },
  publishYear: {
    type: Number,
  },

  Status: {
    type: String,
    required: true,

  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true });

const Books = mongoose.model("Books", booksSchema);

module.exports = Books;
