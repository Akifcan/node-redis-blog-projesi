const open = document.querySelector('.menu')
const back = document.querySelector('.back')

const aside = document.querySelector('.aside')
open.addEventListener('click', function(){
    aside.classList.add('active')
})

back.addEventListener('click', function(){
    aside.classList.remove('active')
})