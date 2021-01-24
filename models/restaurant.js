//require mongoose
const mongoose = require('mongoose')

//set Schema
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name: String,
  phone: String,
  rating: Number,
  google_map: String,
  category: String,
  image: String,
  location: String,
  description: String
})

//export model
module.exports = mongoose.model('Restaurant', restaurantSchema)