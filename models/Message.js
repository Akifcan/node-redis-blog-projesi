const mongoose = require('mongoose')
const os = require( 'os' )
const networkInterfaces = os.networkInterfaces()

const MessageSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Lütfen isminizi belirtin'],
        min: [3, 'İsminiz en az 3 karakter içermeli'],
        max: [50, 'İsminiz en fazla 50 karakter içermeli'],
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'E-Posta adresinizi yanlış girdiniz'],
    },
    topic: {
        type: String,
        required: [true, 'Lütfen başlığı belirtin'],
        min: [3, 'Başlık en az 3 karakter içermeli'],
        max: [50, 'Başlık en fazla 50 karakter içermeli'],
    },
    message: {
        type: String,
        required: [true, 'Lütfen mesajnızı belirtin'],
        min: [10, 'Mesajınız en az 10 karakter içermeli'],
        max: [2000, 'Mesajınız en fazla 2000 karakter olaibilir']
    },
    isReplied: {
        type: Boolean,
        default: false
    },
    ip: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

MessageSchema.pre('save', function(next){
    this.ip = networkInterfaces['Loopback Pseudo-Interface 1'][0].address
    next()
})

module.exports = mongoose.model('messages', MessageSchema)