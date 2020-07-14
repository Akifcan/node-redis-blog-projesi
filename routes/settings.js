const router = require('express').Router()
const Settings = require('../controllers/Settings')

router.get('/', Settings.showSettings)
router.get('/comments', Settings.comments)
router.get('/posts', Settings.posts)
router.get('/messages', Settings.messages)
router.get('/forbidden', Settings.forbiddenList)

router.get('/delete-comment/:id', Settings.deleteComment)
router.get('/delete-post/:id', Settings.deletePost)
router.get('/edit-post/:id', Settings.editPost)
router.get('/read-message/:id', Settings.readMessage)
router.get('/remove-from-forbidden-list/:ip', Settings.removeFromForbidenList)
router.get('/set-post-status/:id', Settings.setPostStatus)

router.post('/update-page-settings', Settings.updatePageSettings)
router.post('/update-post', Settings.updatePost)
router.post('/reply-message', Settings.replyMessage)
module.exports = router