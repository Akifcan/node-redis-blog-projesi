const route = require('express').Router()
const Message = require('../controllers/Message')
const router = require('express').Router()

router.get('/send-message', Message.index)
router.post('/send-message', Message.sendMessage)
router.get('/your-message-taken', Message.yourMessageTaken)

module.exports = router