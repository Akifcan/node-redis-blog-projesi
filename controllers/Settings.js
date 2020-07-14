const { validPageSettings } = require('../helpers')
const localStorage = require('localStorage')
const { listPostComments, postList } = require('../helpers')
const redis = require("redis")
const client = redis.createClient()
const PostModel = require('../models/Post')
const slug = require('slug')
const fs = require('fs')
const MessageModel = require('../models/Message')
const nodemailer = require('nodemailer')
const ForbidenListModel = require('../models/ForbidenList')
const Post = require('../models/Post')

class Settings {
    static showSettings(req, res, next) {
        console.log(localStorage.getItem('title'))
        res.render('settings/settings', {
            pageTitle: 'Sayfa Ayarları',
            pageSettings: {
                title: localStorage.getItem('title'),
                email: localStorage.getItem('email'),
                author: localStorage.getItem('author'),
                description: localStorage.getItem('description'),
            }
        })
    }

    static comments(req, res, next) {
        listPostComments('comments')
            .then(comments => {
                console.log(comments)
                res.render('settings/comments', {
                    pageTitle: 'Yorumlar',
                    comments
                })
            })
    }

    static deleteComment(req, res, next) {
        const id = req.params.id
        client.del(id, (err, reply) => {
            if (err) {
                console.log(err)
                req.session.error = 'Beklenmedik bir hata oluştu lütfen tekrar deneyin'
            }
            req.session.success = 'Silme İşlemi Başarılı'
            res.redirect('back')
        })
    }


    static updatePageSettings(req, res, next) {
        const { title, email, author, description } = req.body
        const valid = validPageSettings(req.body)
        if (valid == true) {
            localStorage.setItem('title', title)
            localStorage.setItem('email', email)
            localStorage.setItem('author', author)
            localStorage.setItem('description', description)
            req.session.success = 'Sayfa Ayarları Güncellenmiştir'
            res.redirect('back')
        } else {
            req.session.validations = valid
            res.redirect('back')
        }
    }

    static posts(req, res, next) {
        const userIsExists = req.session.user ? true : false
        postList(userIsExists)
            .then(posts => {
                res.render('settings/posts', {
                    pageTitle: 'Gönderiler',
                    posts
                })
            })
    }

    static deletePost(req, res, next) {
        const postId = req.params.id
        PostModel.deleteOne({ _id: postId })
            .then(deleted => {
                req.session.success = 'Paylaşım silinmiştir'
                res.redirect('back')
            })
    }

    static editPost(req, res, next) {
        const postId = req.params.id
        PostModel.findOne({ _id: postId }).lean()
            .then(post => {
                if (post) {
                    req.session.postId = postId
                    res.render('settings/editPost', {
                        pageTitle: post.title,
                        post
                    })
                } else {
                    req.session.error = 'Böyle bir gönderi bulunamadı'
                    res.redirect('back')
                }
            })
    }

    static updatePost(req, res, next) {
        const postId = req.session.postId
        PostModel.findOne({ _id: postId })
            .then(post => {
                if (post) {
                    if (!req.body.allowComments) {
                        req.body.allowComments = false
                    } else {
                        req.body.allowComments = true
                    }
                    if (!req.files || Object.keys(req.files).length === 0) {
                        PostModel.updateOne({ _id: postId }, req.body)
                            .then(updated => {
                                req.session.success = 'Güncelleme İşlemi Başarılı'
                                res.redirect('back')
                            })
                    } else {
                        fs.unlink(`public/${post.imagePath}`, (error) => {
                            if (error) {
                                throw error
                            }
                            const image = req.files.image
                            const imagePath = `public/images/${slug(req.body.title)}${image.name}`
                            const imageDbPath = `/images/${slug(req.body.title)}${image.name}`

                            image.mv(imagePath, (error) => {
                                if (error) {
                                    throw error
                                }
                                PostModel.updateOne({ _id: post._id }, { ...req.body, imagePath: imageDbPath })
                                    .then(updated => {
                                        req.session.success = 'Güncelleme İşlemi Başarılı'
                                        res.redirect('back')
                                    })
                            })
                        })
                    }
                } else {
                    req.session.error = 'Böyle bir paylaşım bulunamadı'
                    res.redirect('back')
                }
            })
    }

    static messages(req, res, next) {
        MessageModel.find().sort({ isReplied: 1 }).lean()
            .then(messages => {
                console.log(messages)
                res.render('settings/messages', {
                    pageTitle: 'Mesajlar',
                    messages
                })
            })
    }

    static readMessage(req, res, next) {
        MessageModel.findOne({ _id: req.params.id }).lean()
            .then(message => {
                if (message) {
                    req.session.messageDetails = message
                    res.render('settings/readMessage', {
                        message
                    })
                } else {
                    res.send('Mesaj Bulunamadı')
                }
            })
    }

    static replyMessage(req, res, next) {
        if(req.body.text.length >= 1){
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            })
    
            var mailOptions = {
                from: process.env.EMAIL,
                to: req.session.messageDetails.email,
                subject: `${req.session.messageDetails.topic} Konulu Sorunuz `,
                text: req.body.text
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                  req.session.error = 'Beklenmedik bir hata oluştu lütfen tekrar dener misiniz?'
                  res.redirect('/settings/messages')
                } else {
                  console.log('Email sent: ' + info.response);
                  req.session.success = 'Yanıtınız gönderildi'
                  MessageModel.updateOne({_id: req.session.messageDetails._id}, {isReplied: true})
                  .then(updated => console.log('ok'))
                  res.redirect('/settings/messages')
                }
              }); 
        }else{
            req.session.error = 'Lütfen yanıtınızı yazın'
            res.redirect('back')
        }
    }

    static forbiddenList(req, res, next){
        ForbidenListModel.aggregate([
            { "$group": {
              "_id": "$ip",
            }},
          ])
          .then(ips => {
              console.log(ips)
            res.render('settings/forbidden', {
                pageTitle: 'Yasaklı Listesi',
                ips
            })
          })
    }

    static removeFromForbidenList(req, res, next){
        const ip = req.params.ip
        ForbidenListModel.deleteMany({ip})
        .then(response => {
            req.session.success = 'Yasaklı Listesinden Kaldırılmıştır'
            res.redirect('back')
        })
        .catch(error => {
            req.session.error = 'Beklenmedik bir hata oluştu lütfen tekrar deneyin'
            res.redirect('back')
        })
    }

    static setPostStatus(req, res, next){
        const _id = req.params.id
        Post.findOne({_id})
        .then(post => {
            if(post){
                post.isActive = !post.isActive
                post.save()
                .then(response => {
                    res.redirect('back')
                })
            }
        })
        .catch(error => {
            req.session.error = 'Bir hata oluştu lütfen tekrar dener misiniz?'
            res.redirect('back')
        })    
    }

}

module.exports = Settings