'use strict'
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const yelp = require('yelp-fusion')
const twilio = require('twilio')
const client = yelp.client(process.env.YELP_KEY)

const accountSid = process.env.SID
const authToken = process.env.APKEY
const clientT = new twilio(accountSid, authToken)

const router = require('express').Router()
const {Business, Category} = require('../db/models')

// E.G. api/business?category=Barbershop
router.get('/', async (req, res, next) => {
  try {
    if (req.query.category) {
      const category = await Category.findOne({
        where: {
          categoryType: req.query.category
        }
      })
      // retrieves business with that category
      const businesses = await category.getBusiness()
      res.json(businesses)
    } else {
      const businesses = await Business.findAll()
      res.json(businesses)
    }
  } catch (err) {
    console.error(err)
  }
})

router.get('/:id', async (req, res, next) => {
  const today = new Date() // creates new date object at current time
  today.setHours(0, 0, 0, 0) // sets time of date object to beginning of the day
  try {
    let closed = true
    const business = await Business.findById(req.params.id)
    if (!business) {
      res.sendStatus(404)
    } else {
      client
        .search({
          term: business.name,
          location: 'chicago'
        })
        .then(response => {
          console.log(response.jsonBody.businesses)
          closed = response.jsonBody.businesses[0].is_closed
          res.send({business, closed})
          //console.log(business)
        })
        .catch(e => {
          console.log(e)
        })
    }
  } catch (err) {
    console.log(err)
  }
})

router.get('/search/:keyword', async (req, res, next) => {
  try {
    const keyword = req.params.keyword
    const businesses = await Business.findAll({
      where: {
        name: {
          [Op.iLike]: `%${keyword}%`
        }
      }
    })
    res.json(businesses)
  } catch (err) {
    next(err)
  }
})

//messages
router.post('/inbound', (req, res, next) => {
  try {
    clientT.messages
      .create({
        body: `Hello ${req.body.FromCity} ${
          req.body.FromState
        },  thanks for you fidelite`,
        to: req.body.From,
        from: '+13312446019'
      })
      .then(() => {})
    console.log(req.body)
    res.send('')
  } catch (err) {
    next(err)
  }
})

module.exports = router
