const router = require('express').Router()
const post = require('./post')
const auth = require('./auth')
const settings = require('./settings')
const about = require('./about')
const message = require('./message')


router.use('/auth', auth)
router.use('/settings',  require('../middlewares/auth').isUserExists, settings)
router.use('/about', about)
router.use('/message', message)
router.use('/', post)

module.exports = router