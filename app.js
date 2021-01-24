//require packages and json file 
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant.js')
const features = ['name', 'en_name', 'phone', 'rating', 'google_map', 'category', 'image', 'location', 'description']
const featureList = ['餐廳中文', '餐廳英文', '電話號碼', '饕客評分', '谷歌地圖', '餐廳類別', '照片網址', '餐廳地點', '餐廳描述']

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

//set router of new page
app.get('/restaurants/new', ((req, res) => {
  res.render('new', { featureList, features })
}))
app.post('/restaurants', ((req, res) => {
  if (req.body.image.length === 0) { req.body.image = 'https://www.teknozeka.com/wp-content/uploads/2020/03/wp-header-logo-33.png' }
  const restaurant = req.body
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
}))

//set router of show page
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

//set router of edit page
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  let restaurant_modified = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      features.forEach(i => {
        restaurant[i] = restaurant_modified[i]
      })
      restaurant.save()
      return restaurant
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//set router of delete
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//set router of search results
app.get('/search', ((req, res) => {
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

//start and listen on the server
app.listen(port, () => {
  console.log(`Expres is now running on https://localhost:${port}`)
})
