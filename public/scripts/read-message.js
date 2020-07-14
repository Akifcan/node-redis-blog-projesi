const showIp = document.querySelector('.show-ip')
const messageArea = document.querySelector('.message-area')

showIp.addEventListener('click', () => {
    const ip = showIp.dataset.ip
    fetch(`https://ipapi.co/${ip}/json`)
    .then(response => response.json())
    .then(data => {
        const div = document.createElement('div')
        const city = document.createElement('p')
        const country = document.createElement('p')
        const timezone = document.createElement('p')

        city.innerHTML = `<p><b>Şehir:</b> ${data.city}</p>`
        country.innerHTML = `<p><b>Ülke:</b> ${data.country}</p>`
        timezone.innerHTML = `<p><b>Zaman Dilimi:</b> ${data.timezone}</p>`

        div.appendChild(city)
        div.appendChild(country)
        div.appendChild(timezone)

        messageArea.appendChild(div)
    })
})