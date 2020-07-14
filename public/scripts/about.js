CKEDITOR.replace('edit')
const editButton = document.querySelector('.edit')
const aboutMeText =  document.querySelector('.about-me-text')
const editAboutMe  = document.querySelector('.edit-about-me')

editButton.addEventListener('click', () => {
    aboutMeText.classList.toggle('deactive')
    editAboutMe.classList.toggle('active')

    if(editAboutMe.classList.contains('active')){
        editButton.innerText = 'Kapat'
    }else{
        editButton.innerText = 'Düzenle'
    }

})