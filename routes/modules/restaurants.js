const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant.js')
const features = ['name', 'en_name', 'phone', 'rating', 'google_map', 'category', 'image', 'location', 'description']
const featureList = ['餐廳中文', '餐廳英文', '電話號碼', '饕客評分', '谷歌地圖', '餐廳類別', '照片網址', '餐廳地點', '餐廳描述']

//set router of new page
router.get('/new', ((req, res) => {
  res.render('new', { featureList, features })
}))
router.post('/', ((req, res) => {
  if (req.body.image.length === 0) { req.body.image = 'https://www.teknozeka.com/wp-content/uploads/2020/03/wp-header-logo-33.png' }
  const restaurant = req.body
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
}))

//set router of show page
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

//set router of edit page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router