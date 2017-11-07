const dotenv = require('dotenv')
const app = require('express')()
const mongo = require('mongodb').MongoClient
const assert = require('assert')
const engines = require('consolidate')
const path = require('path')
const api = require('./app/api')

const port = process.argv[2] || 3000
dotenv.config()

// Configure template middleware
app.engine('njk', engines.nunjucks)
app.set('view engine', 'njk')
app.set('views', path.join(__dirname, 'views'))


// Initialize External API
const GoogleImages = require('google-images')
const extAPI = new GoogleImages(process.env.SEID, process.env.APIKEY)


// Connect to mongoDB image search database
mongo.connect(process.env.MONGO_URI, (err, db) => {

  assert.equal(null, err)

  console.log("Successfully connected to MongoDB.")

  // Cross-Origin Header Middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
  })

  // Call application api
  api(app, db.collection('imagesearch'), extAPI)

  // Error Handler Middleware
  app.use((err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)
    res.status(500)
    res.send(`Error: ${err.message}`)
  })
  
  // All Middleware functions and routes exhausted, respond with 404
  app.use(function (req, res, next) {
    res.status(404).send("404 Page Not Found")
  })

})


// Start Express server
const server = app.listen(port, () => {
  const {port, address} = server.address()
  console.log(`Server started on ${address}:${port}`)
})