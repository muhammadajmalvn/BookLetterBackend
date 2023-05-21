const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true
  },
});

const model = mongoose.model('Genre', genreSchema);

module.exports = model;
