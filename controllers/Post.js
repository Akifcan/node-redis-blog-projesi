const PostModel = require('../models/Post')
const slug = require('slug')
const shortid = require('shortid')

const redis = require("redis")
const client = redis.createClient()
const { listPostComments, postList } = require('../helpers')

class Post {
    static getAll(req, res, next) {
        const userIsExists = req.session.user ? true : false
        postList(userIsExists)
            .then(posts => {
                res.render('home', {
                    posts
                })
            })
    }

    static get(req, res, next) {
        PostModel.findOne({ slug: req.params.slug }).lean()
            .then(post => {
                const postId = post._id.toString()
                listPostComments(postId)
                    .then(comments => {
                        req.session.postId = post._id.toString()
                        req.session.postId = post._id
                        res.render('post', {
                            post,
                            comments
                        })
                    })
            })
    }
    static create(req, res, next) {
        res.render('create')
    }

    static doComment(req, res, next) {
        const { name, email, comment } = req.body
        const commentId = shortid.generate()
        const postId = req.session.postId
        client.hmset(commentId, ['name', name, 'email', email, 'comment', comment, 'id', commentId], function (err, reply) {
            if (err) { throw err }
            client.sadd(postId, commentId, function (err, saved) {
                if (err) { throw err }
                client.sadd('comments', commentId, function (err, saved) {
                    if (err) { throw err }
                })
            })
        })
    }


    static createPost(req, res, next) {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.render('create', {
                message: 'Lütfen bir resim seçin',
                class: 'background-red'
            })
        }
        const image = req.files.image
        const imagePath = `public/images/${slug(req.body.title)}${image.name}`
        const imageDbPath = `/images/${slug(req.body.title)}${image.name}`
        image.mv(imagePath, function (err) {
            if (err) {
                res.render('create', {
                    message: 'Lütfen resim seçin',
                    class: 'background-red'
                })
            }
            const post = new PostModel({
                title: req.body.title,
                subtitle: req.body.subtitle,
                imagePath: imageDbPath,
                content: req.body.content,
                isActive: true,
                allowComments: req.body.allowComments == 'on' ? true : false
            })
            post.save()
                .then(created => {
                    res.render('create', {
                        message: 'Yazının Oluşturuldu',
                        class: 'background-green'
                    })
                })
                .catch(error => {
                    res.render('create', {
                        errorList: error.message.split(',')
                    })
                })

        })
    }



}

module.exports = Post