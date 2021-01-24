//require packages and json file 
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant.js')

//set database connection
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

//get status of connection of database
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

//set template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//use static files and body-parser
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

//set router of root page
app.get('/', ((req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
}))

//set router of show page
app.get('/restaurants/:id', ((req, res) => {
  const restaurant = restaurantList.find(restaurant => restaurant.id.toString() === req.params.id)
  res.render('show', { restaurant: restaurant })
}))

//set router of search results
app.get('/search', ((req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.filter(restaurant => {
    return (restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword))
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
}))

//start and listen on the server
app.listen(port, () => {
  console.log(`Expres is now running on https://localhost:${port}`)
})