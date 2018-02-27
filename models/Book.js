var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BookSchema = new Schema({
  isbn: String,
  title: String,
  author: String,
  descrption: String,
  published_date: {type: Date},
  publisher: String,
  update_date: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Book', BookSchema);