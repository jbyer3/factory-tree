const express = require('express');
const router = express.Router();
const db = require('../models')

router.get('/', (req, res) => {
  db.Factory.find()
    .then(factories => {
      res.json(factories);
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/', (req, res) => {
  db.Factory.create(req.body)
    .then(newFactory => {
      res.status(201).json(newFactory);
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:factoryId', (req, res) => {
  db.Factory.findById(req.params.factoryId)
    .then(foundFactory => {
      res.json(foundFactory)
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/:factoryId', (req, res) =>{
  db.Factory.findOneAndUpdate({_id: req.params.factoryId}, req.body, {new: true})
    .then(factory => {
      res.json(factory)
    })
    .catch(err => {
      res.send(err)
    })
})

router.delete('/:factoryId', (req, res) => {
  db.Factory.remove({_id: req.params.factoryId})
    .then(() => res.send('deleted!'))
    .catch(err => res.send(err))
})

module.exports = router;