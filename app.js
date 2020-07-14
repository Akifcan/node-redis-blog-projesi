const express = require('express')
const exphbs  = require('express-handlebars')
const express_handlebars_sections = require('express-handlebars-sections')
const session = require('express-session')
const fileUpload = require('express-fileupload')
const localStorage = require('localStorage')
const moment = require('moment')
const ForbidenList = require('./models/ForbidenList')
require('dotenv').config({path: 'config/.env'})
const os = require( 'os' )


const app = express()

//connect db
require('./config/db')()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(fileUpload())
app.engine('handlebars', exphbs({
    helpers: {
        section: express_handlebars_sections(),
        ifNot: (val, option) => {
            console.log(val)
            return val == false ? option.fn(true) : option.inverse(this)
        },
        avatarLetter: (val) => val[0].toUpperCase(),
    }
}))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))
app.use(function (req, res, next) {
    const networkInterfaces = os.networkInterfaces()
    const ip = networkInterfaces['Loopback Pseudo-Interface 1'][0].address

    ForbidenList.find({ip: ip})
    .then(response => {
        if(response.length >= 5){
            res.status(403).send('Forbiden')
        }else{
            res.locals.pageSettings = {
                title: localStorage.getItem('title'),
                author: localStorage.getItem('author'),
                description: localStorage.getItem('description'),
                email: localStorage.getItem('email'),
            }
            res.locals.success = req.session.success
            res.locals.error = req.session.error
            res.locals.validations = req.session.validations
            res.locals.user = req.session.user
            delete req.session.success
            delete req.session.validations
            delete req.session.error
            next()
        }
    })
})
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(require('./routes/index'))

app.listen(process.env.PORT, () => console.log('Working on 3000'))