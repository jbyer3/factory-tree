const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.set("useFindAndModify", false);
mongoose.connect(
  "mongodb://localhost/factory-tree",
  { useNewUrlParser: true }
);

mongoose.Promise = Promise;

module.exports.Factory = require('./factory')