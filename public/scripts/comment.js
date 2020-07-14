const toggleComment = document.querySelector('.toggleComment')
const doComment = document.querySelector('.do-comment')
const comments = document.querySelector('.comments')

toggleComment.addEventListener('click', () => {
    doComment.classList.toggle('active')
    if(doComment.classList.contains('active')){
        toggleComment.innerText = 'Gizle'
    }else{
        toggleComment.innerText = 'Yorum Yap'
    }
})

doComment.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const comment = document.getElementById('comment').value

    addCommentToDiv(comment, name)
    fetch('/do-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, email, comment})
    })

})

function addCommentToDiv(text, username){
    const div = document.createElement('div')
    div.classList.add('comment')

    const userInfoDiv = document.createElement('div')
    userInfoDiv.classList.add('user-info')

    const userAvatarDiv = document.createElement('div')
    userAvatarDiv.classList.add('user-avatar')
    userAvatarDiv.innerText = username[0].toUpperCase()

    const usernameDiv = document.createElement('div')
    usernameDiv.classList.add('username')
    usernameDiv.innerText = username

    userInfoDiv.append(userAvatarDiv)
    userInfoDiv.append(usernameDiv)

    const commentDiv = document.createElement('div')
    commentDiv.classList.add('text')
    const commentP = document.createElement('p')
    commentP.innerText = text
    commentDiv.appendChild(commentP)

    div.appendChild(userInfoDiv)
    div.appendChild(commentDiv)

    comments.prepend(div)
    doComment.classList.remove('active')

}