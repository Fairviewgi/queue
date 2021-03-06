const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/owner', require('./owner'))
router.use('/business', require('./business'))
router.use('/reservation', require('./reservation'))
router.use('/categories', require('./categories'))
router.use('/appointments', require('./appointments'))
router.use('/slots', require('./slots'))
router.use('/stylistSlot', require("./stylistSlot"))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
