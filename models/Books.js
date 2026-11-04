const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
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
    type: String,
     enum:['1 Star','2 Star','3 Star','3 Star','4 Star','5 Star']

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
