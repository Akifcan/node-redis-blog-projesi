const increase = document.querySelector('.increase')
const decrease = document.querySelector('.decrease')

let fontSize = 16

increase.addEventListener('click',() => {
    if(fontSize<=30){
        fontSize++
        document.body.style.fontSize = `${fontSize}px`
    }
})

decrease.addEventListener('click',() => {
    if(fontSize>=16){
        fontSize--;
        document.body.style.fontSize = `${fontSize}px`
    }
})





