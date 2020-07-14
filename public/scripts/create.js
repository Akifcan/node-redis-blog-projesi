const alertBox = document.querySelector('.alert')
const p = alertBox.querySelector('p')
const checkbox = document.getElementById('allowComments')
const form = document.querySelector('form')

checkbox.addEventListener('change', function(){
    if(checkbox.checked){
        alertBox.className = 'alert background-green mb-5'
        p.innerText = 'Yorumlara İzin Verdiniz'
    }else{
        alertBox.className = 'alert background-red mb-5'
        p.innerText = 'Bu gönderi için yorumları kapattınız'
    }
})

CKEDITOR.replace('content')