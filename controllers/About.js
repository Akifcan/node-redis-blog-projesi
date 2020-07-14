const localStorage = require('localStorage')
class About{
    
    static index(req, res, next){
        res.render('about', {
            about: localStorage.getItem('about')
        })
    }

    static update(req, res, next){
        if(req.body.about.length >= 20){
            localStorage.setItem('about', req.body.about)
            req.session.success = 'Hakkımda yazınız güncellendi'
            res.redirect('back')
        }else{
            req.session.error = 'Hakkımda yazısı en az 20 karakter içermeli'
            res.redirect('back')
        }
    }
}

module.exports = About