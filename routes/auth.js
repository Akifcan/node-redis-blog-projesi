const router = require('express').Router()
const Auth = require('../controllers/Auth')
const { isUserExists, isNotUserExists} = require('../middlewares/auth')

router.get('/', isNotUserExists, Auth.login)
router.post('/', isNotUserExists, Auth.createSession)
router.get('/current-user', Auth.currentUser)
router.get('/current-user-is-exists', Auth.currentUserIsExists)
router.get('/logout', isUserExists, Auth.logout)

module.exports = router