//require packages and json file 
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant.js')
const features = ['name', 'en_name', 'phone', 'rating', 'google_map', 'category', 'image', 'location', 'description']
const featureList = ['餐廳中文', '餐廳英文', '電話號碼', '饕客評分', '谷歌地圖', '餐廳類別', '照片網址', '餐廳地點', '餐廳描述']
const methodOverride = require('method-override')
//引入路由器時，路徑設定為 /routes 就會自動去尋找目錄下叫做 index 的檔案。
const routes = require('./routes')
require('./config/mongoose.js')


//set template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//use static files, body-parser, method_override, and routes
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)





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
