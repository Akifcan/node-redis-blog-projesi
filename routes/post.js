const router = require('express').Router()
const Post = require('../controllers/Post')
const { isUserExists} = require('../middlewares/auth')


router.get('/', Post.getAll)
router.get('/create', isUserExists, Post.create)
router.post('/create', isUserExists,  Post.createPost)
router.post('/do-comment', Post.doComment)


router.get('/:slug', Post.get)

module.exports = router