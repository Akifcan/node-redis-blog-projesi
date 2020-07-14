const MessageModel = require('../models/Message')
const { addForbidenList } = require('../helpers')

class Message{
    static index(req, res, next){
        res.render('send-message')
    }

    static yourMessageTaken(req, res, next){
        res.render('your-message-taken')
    }


    static sendMessage(req, res, next){
        const message = new MessageModel(req.body)
        message.save()
        .then(saved => {
            res.redirect('/message/your-message-taken')
        })
        .catch(error => {
            req.session.validations = error.message.split(':')
            addForbiddenList(`${error.message}`)
            res.redirect('back')
        })
    }
}

module.exports = Message