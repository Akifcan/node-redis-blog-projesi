const mongoose = require('mongoose')
const redis = require("redis");
const client = redis.createClient()

client.on("error", function(error) {
    console.error(error)
})

const connectDb = async () => {
    try{
        const connection = await mongoose.connect(process.env.DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log(connection.connection.host)
    }catch(e){
        console.log(e)
        process.exit(1)
    }
}

module.exports = connectDb