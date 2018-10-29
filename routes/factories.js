const express = require('express');
const router = express.Router();
const helpers = require('../helpers/factories')

router.route('/')
  .get(helpers.getFactories)
  .post(helpers.createFactory)

router.route('/:factoryId')
  .get(helpers.getFactory)
  .put(helpers.updateFactory)
  .delete(helpers.deleteFactory)

module.exports = router;