const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        max: 50,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'E-Posta adresinizi yanlış girdiniz'],
    },
    username: {
        type: String,
        max: 50,
        min: 3,
    },
    password: {
        type: String,
        min: 3,
        max: 50,
    }
})

module.exports = mongoose.model('admins', AdminSchema)