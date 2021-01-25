//require mongoose, model, and json
const db = require('../../config/mongoose')
const Restaurant = require('../restaurant.js')
const restaurantList = require('./restaurant.json').results

//create seeders
db.once('open', () => {
  restaurantList.forEach(restaurant => Restaurant.create(restaurant))
  console.log('done!')
})


