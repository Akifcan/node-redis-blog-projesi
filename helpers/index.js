const redis = require("redis")
const client = redis.createClient()
const correct = require('correctjs')
const PostModel = require('../models/Post')
const ForbidenListModel = require('../models/ForbidenList')

const listPostComments = (postId) => {
    return new Promise((resolve, reject) => {
        let comments = []
        client.smembers(postId, (err, reply) => {
            if(err){
                reject(err)
            }
            if(reply.length == 0){
                resolve(comments)
            }
            reply.forEach((comment, index) => {
                client.hgetall(comment, (err, data) => {
                    if(err){
                        reject(err)
                    }
                    if(data != null){
                        comments.push(data)
                    }
                    if(index == reply.length - 1){
                       resolve(comments)
                    }
                })
            })
        })
    })
}

const validPageSettings = (body) => {
    const { title, email, author, description } = body
    return correct(
        [
            {
                value: title,
                fieldName: 'name',
                validations: [
                    {
                        'type': 'required',
                    },
                    {
                        'type': 'min|5',
                        'message': 'Sayfa başlığı en az 5 karakter içermeli',
                    },  
                    {
                        'type': 'max|50',
                        'message': 'Sayfa başlığı en fazla 50 karakter olabilir'
                    },
                ]
            },
            {
                value: email,
                fieldName: 'E-Posta Adresi',
                validations: [
                    {
                        'type': 'required',
                    },
                    {
                        'type': 'min|5',
                        'message': 'Sayfa başlığı en az 5 karakter içermeli',
                    },  
                    {
                        'type': 'max|50',
                        'message': 'Sayfa başlığı en fazla 50 karakter olabilir'
                    },
                    {
                        'type': 'email',
                        'message': 'E-Posta adresini hatalı girdiniz'
                    }
                ]
            },
            {
                value: author,
                fieldName: 'Sayfa Yazarı',
                validations: [
                    {
                        'type': 'required',
                    },
                    {
                        'type': 'min|3',
                        'message': 'Sayfa yazarı alanı en az 3 karakter içermeli',
                    },  
                    {
                        'type': 'max|50',
                        'message': 'Sayfa yazarı alanı en fazla 50 karakter olabilir'
                    },
                ]
            },
            {
                value: description,
                fieldName: 'Sayfa Açıklaması',
                validations: [
                    {
                        'type': 'required',
                    },
                    {
                        'type': 'min|5',
                        'message': 'Sayfa başlığı en az 5 karakter içermeli',
                    },  
                ]
            }
        ]    
    )

}

const postList = async (userIsExists) => {
   const posts = await PostModel.find(userIsExists ? null : { isActive: true }).lean()
    return posts
}


const addForbiddenList = (action) => {
    const forbidenList = new ForbidenListModel({
        action
    })
    forbidenList.save()
    .then(saved => {
        console.log('Saved to forbidden list')
    })
}

module.exports = { listPostComments, validPageSettings, postList, addForbiddenList }