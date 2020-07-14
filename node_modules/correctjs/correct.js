const correct = val => {

    let checkFields = []
    let errors = []
    val.map((field, index) => {
        if(field.value == null){
            checkFields.push({message: 'please provide a value', index: index})
        }
        if(field.validations == null || typeof field.validations != 'object'){
            checkFields.push({message: 'please provide a validations'}, index)
        }
        if(field.fieldName == null || field.fieldName == '' || typeof field.fieldName == 'String'){
            checkFields.push({message: 'please provide a field name', index: index})
        }
    })

    if(checkFields.length >= 1){
        return checkFields
    }

    val.forEach(field => {
        field.validations.forEach(validate => {
            if(validate.type == 'required' && field.value == ''){
                errors.push(validate.message ? validate.message : `${field.fieldName} is required`)
            }
            if(validate.type.split('|')[0] == 'min' && field.value.length < validate.type.split('|')[1]){
                errors.push(validate.message ? validate.message : `${field.fieldName} at least ${validate.type.split('|')[1]} character`)
            }
            if(validate.type.split('|')[0] == 'max' && field.value.length > validate.type.split('|')[1]){
                errors.push(validate.message ? validate.message : `${field.fieldName} is not be greater than ${validate.type.split('|')[1]} character`)
            }
            if(validate.type == 'email'){
                let email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if(!email.test(field.value)){
                    errors.push(validate.message ? validate.message : `${field.fieldName} is not email address`)
                }
            }
            if(validate.type == 'number'){
                let number = /^\d+$/
                if(!number.test(field.value)){
                    errors.push(validate.message ? validate.message : `${field.fieldName} is not number`)
                }
            }
            if(validate.type.split('|')[0] == 'customRegex'){
                let regex = validate.type.split('|')[1]
                let customRegex = new RegExp(regex)
                if(!customRegex.test(field.value)){
                    errors.push(validate.message ? validate.message : `${field.fieldName} is not match custom regex`)
                }
            }
            if(validate.type.split('|')[0] == 'between'){
                let values = validate.type.split('|')[1].split('-')
                if(field.value < values[0] || field.value > values[1]){
                    errors.push(validate.message ? validate.message : `${field.fieldName} is must between ${values[0]} - ${values[1]}`)
                }
            }
            if(validate.type.split('|')[0] == 'startsWith'){
                if(!field.value.startsWith(validate.type.split('|')[1])){
                    errors.push(validate.message ? validate.message : `${field.fieldName} is not starts with ${validate.type.split('|')[1]}`)
                }
            }
            if(validate.type.split('|')[0] == 'endsWith'){
                if(!field.value.endsWith(validate.type.split('|')[1])){
                    errors.push(validate.message ? validate.message : `${field.fieldName} is not ends with ${validate.type.split('|')[1]}`)
                }
            }
            if(validate.type.split('|')[0] == 'matchLength' && field.value.length != parseInt(validate.type.split('|')[1])){
                errors.push(validate.message ? validate.message : `${field.fieldName} is length must be ${validate.type.split('|')[1]} character`)
            }
        })
    })

    if(errors.length >= 1){
        return errors
    }

    return true

}

module.exports = correct