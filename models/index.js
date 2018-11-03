const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.set("useFindAndModify", false);
mongoose.connect(
  // "mongodb://passport:db4passport@ds151383.mlab.com:51383/treeview4passport",
  process.env.MONGODB_URI || "mongodb://localhost/factory-tree",
  { useNewUrlParser: true }
);

mongoose.Promise = Promise;

module.exports.Factory = require('./factory')