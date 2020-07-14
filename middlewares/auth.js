const { addForbiddenList } = require('../helpers')

const isUserExists = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        addForbiddenList('forbidden auth')
        return res.redirect('back')
    }
}

const isNotUserExists = (req, res, next) => {
    if(!req.session.user){
        next()
    }else{
        return res.redirect('back')
    }
}

module.exports = {
    isUserExists, isNotUserExists
}