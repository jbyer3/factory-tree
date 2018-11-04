const mongoose = require('mongoose');

var factorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Factory needs a name...'
  },
  lower_bound: {
    type: Number,

  },
  upper_bound: {
    type: Number,
  },
  num_children: {
    type: Number,
  },
  children: {
    type: Array
  }
})

const Factory = mongoose.model('Factory', factorySchema)

module.exports = Factory