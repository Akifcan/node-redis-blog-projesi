const Admin = require('../models/Admin')
const md5 = require('md5')

class Auth{
    static login(req, res, next){
        res.render('login')
    }
    static createSession(req, res, next){
        Admin.findOne({
            email: req.body.email,
            password: md5(req.body.password)
        })
        .then(user => {
            if(user){
                req.session.user = user
                res.status(200).json({success: true})
            }else{
                res.status(404).json({success: false})
            }
        })
    }
    static currentUser(req, res, next){
        res.status(200).json({user: req.session.user})
    }
    static currentUserIsExists(req, res, next){
        res.status(200).json({session: req.session.user ? true : false})
    }
    static logout(req, res, next){
        delete req.session.user
        res.redirect('/auth')
    }
}

module.exports = Auth