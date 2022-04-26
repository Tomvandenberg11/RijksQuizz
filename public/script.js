let socket = io()
let input = document.querySelector('input')
const nameContainer = document.querySelector('.username')
const chat = document.querySelector('.start')
const startButton = document.querySelector('.startButton')

const users = document.querySelector('.users > ul')


nameContainer.addEventListener('submit', event => {
  event.preventDefault()
  if (input.value) {
    socket.emit('new user', input.value)
    document.querySelector('.username').classList.add('displayNone')
    chat.classList.remove('displayNone')
  }
})

socket.on('new user', user => {
  users.appendChild(Object.assign(document.createElement('li'), { textContent: user }))
})


startButton.addEventListener("click", (e) => {
  e.preventDefault()

  document.querySelector('.start').classList.add('displayNone')
  document.querySelector('.item').classList.remove('displayNone')
})

socket.on('showData', (artData) => {
  document.querySelector('.item > ul').appendChild(Object.assign(document.createElement('li'), { textContent: artData.text }))
  document.querySelector('.item > ul').appendChild(Object.assign(document.createElement('img'), { src: artData.image }))
  console.log(artData.maker)
})
