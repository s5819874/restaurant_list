//require packages and json file 
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json').results

//set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//use static files
app.use(express.static('public'))

//set router of root page
app.get('/', ((req, res) => {
  res.render('index', { restaurants: restaurantList })
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