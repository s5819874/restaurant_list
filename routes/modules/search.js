const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')

//set router of search results
router.get('/', ((req, res) => {
  const keyword = req.query.keyword
  return Restaurant.find({
    $or: [
      {
        category: {
          $regex: keyword,
          $options: 'i'
        }
      },
      {
        name: {
          $regex: keyword,
          $options: 'i'
        }
      },
    ]
  })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
}))

module.exports = router