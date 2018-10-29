const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect(
  "mongodb://localhost/factory-tree",
  { useNewUrlParser: true }
);

mongoose.Promise = Promise;

module.exports.Factory = require('./factory')