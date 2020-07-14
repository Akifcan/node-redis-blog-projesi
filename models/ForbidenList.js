const mongoose = require('mongoose')
const os = require( 'os' )
const networkInterfaces = os.networkInterfaces()


const ForbidenListSchema = mongoose.Schema({
    time: {
        type: Date,
        default: Date.now
    },
    ip: String,
    action: String
})

ForbidenListSchema.pre('save', function(next){
    this.ip = networkInterfaces['Loopback Pseudo-Interface 1'][0].address
    next()
})

module.exports = mongoose.model('forbidenlists', ForbidenListSchema)