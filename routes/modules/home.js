const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')

//set router of root page
router.get('/', ((req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
}))

module.exports = router