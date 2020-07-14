const email = document.getElementById('email')
const password = document.getElementById('password')
const form = document.querySelector('.login')


form.addEventListener('submit', function(e){
    e.preventDefault()
    if(emailRegex()){
        fetch('auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email.value, password: password.value})
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                window.location.href = '/'
            }else{
                const showAlert = document.querySelector('.alert')
                if(!showAlert){
                   createAlertBox('Böyle bir kullanıcı bulunamadı', 'background-red')
                }else{
                    showAlert.innerText = 'Böyle bir kullanıcı bulunamadı'
                }
            }
        })
    }else{
       createAlertBox('E-Posta adresini hatalı girdiniz', 'background-red')
    }
})

function createAlertBox(alertText, alertClass){
    const alertBox = document.createElement('div')
    const p = document.createElement('p')
    alertBox.className = `alert ${alertClass}`
    p.innerText = alertText
    alertBox.appendChild(p)
    document.body.appendChild(alertBox)
}


function emailRegex(){
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(email.value)
}
