const router = require('express').Router()
const About = require('../controllers/About')

router.get('/', About.index)
router.post('/update-about', About.update)

module.exports = router