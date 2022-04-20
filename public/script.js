let socket = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')

const nameContainer = document.querySelector('.username')
const chat = document.querySelector('section:last-of-type')
const chatForm = document.querySelector('.chatForm')

const chatText = document.querySelector('#chatText')

nameContainer.addEventListener('submit', event => {
  event.preventDefault()
  if (input.value) {
    socket.emit('new user', input.value)
    nameContainer.classList.add('displayNone')
    chat.classList.remove('displayNone')
  }
})

chatForm.addEventListener('submit', event => {
  event.preventDefault()
  console.log('jaaa')
  if (chatText.value) {
    socket.emit('message', chatText.value)
    chatText.value = ''
  }
})

socket.on('message', message => {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  messages.scrollTop = messages.scrollHeight
})

