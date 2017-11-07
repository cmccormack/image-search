
// Define Search Options
const search_options = {
  page: 1,
  safe: 'high'
}

// Define example template values

const templateOptions = {
  hostname: ''
}

module.exports = (app, db, externalAPI) => {

  app.get(['/','/imagesearch'], (req, res, next) => {
    templateOptions.hostname = req.host
    res.render('examples', require('./exampleTemplate')(templateOptions))
  })

  app.get('/latest', (req, res, next) => {
    console.log(req.headers)
    db.find({}, {_id: 0}).sort({ 'when': -1 }).toArray((err, docs) => {
      docs = docs.map(doc => {
        doc.when = new Date(doc.when).toISOString()
        return doc
      })
      res.type('json').send(JSON.stringify(docs))
    })
  })

  app.get('/imagesearch/:search', (req, res, next) => {

    // Handle page offset if provided
    if (req.query.offset && req.query.offset > 0){
      search_options.page = req.query.offset
    }

    // Call API with search parameters
    externalAPI.search(req.params.search, search_options)
      .then((results)=>{
        const resultsParsed = results.map(r => {
          return { 
            url: r.url,
            alttext: r.description,
            thumbnail: r.thumbnail.url,
            context: r.parentPage
          }
        })
        res.type('json').send(JSON.stringify(resultsParsed))
      })
      .catch((err)=>{
        console.error(err)
        res.type('json').send(
          JSON.stringify({
            query: req.params.search,
            error: err.message
          })
        )
      })

    // Add search query to database
    db.insertOne({
      term: req.params.search,
      when: new Date().getTime()
    }, (err, r) => {
      if (err)
        console.error(err.message)
      else
        console.log(`'${req.params.search}' successfully added to database!`)
    })
  })

  // Call API just to view images (not a user story)
  app.get('/:search', (req, res, next) => {
    // Handle page offset if provided
    if (req.query.offset && req.query.offset > 0) {
      search_options.page = req.query.offset
    }

    // Call API with search parameters
    externalAPI.search(req.params.search, search_options)
      .then((results) => {
        const imageTemplate = {
          images: results.map(r => {
            return { url: r.url, alt: r.alttext}
          }),
          title: 'Image Search Results',
          search: req.params.search
        }
        res.render('images', imageTemplate)
      })
      .catch((err) => {
        console.error(err)
        res.type('json').send(
          JSON.stringify({
            query: req.params.search,
            error: err.message
          })
        )
      })
  })

}

