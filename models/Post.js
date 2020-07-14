const mongoose = require('mongoose')
const slug = require('slug')

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        min: [3,'Başlığınız en az 3 karakter içermeli'],
        max: [50, 'Başlığınız en fazla 50 karakter olabilir'],
        required: [true, 'Lütfen başlığı belirtin'],
    },
    slug: {
        type: String,
        min: 3,
        max: 70,
        unique: true
    },
    subtitle: {
        type: String,
        max: [20, 'Alt başlık en fazla 20 karakter olabilir'],
        required: [true, 'Lütfen alt başlık girin'],
    },
    imagePath: {
        type: String,
        required: true
    },
    content: {
        type: String,
        min: [20, 'Yazı alanı en az 20 karakter olmalı'],
        required: [true, 'Lütfen yazınızı girin']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

PostSchema.pre('save', function(next){
    this.slug = slug(this.title+Math.floor(Math.random() * 500000))
    next()
})

module.exports = mongoose.model('Posts', PostSchema)