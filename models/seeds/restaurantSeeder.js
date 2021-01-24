//require mongoose, model, and json
const mongoose = require('mongoose')
const Restaurant = require('../restaurant.js')
const restaurantList = require('./restaurant.json').results

//set database connection
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

//get status of connection of database
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  //create seeders
  restaurantList.forEach(restaurant => Restaurant.create(restaurant))
  console.log('done!')
})


