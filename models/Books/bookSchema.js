const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  publishedDate: {
    type: Date,
    required: true,
    get: function (value) {
      return value.toLocaleDateString();
    }
  },
  genre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: "Good Book"
  },
  price: {
    type: Number,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  photo: [],
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true
  },
  copies: [
    {
      id: {
        type: String,
        // unique: true
      },
      available: {
        type: Boolean,
        default: true
      }
    }
  ]
});

const model = mongoose.model('Book', bookSchema);

module.exports = model;
