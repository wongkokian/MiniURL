const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find().limit(10).sort({_id:-1})
  const showTable = shortUrls.length > 0
  res.render('index', { showTable, shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })
  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)
  shortUrl.save()
  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);