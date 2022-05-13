let socket = io()

let nameInput = document.querySelector('#name')
const nameContainer = document.querySelector('.username')
const chat = document.querySelector('.start')
const startButton = document.querySelector('.startButton')
const answerField = document.querySelector('#answer')
const answerInput = document.querySelector('#answerInput')
const users = document.querySelector('.users > ul ')

// Event when submitting name
nameContainer.addEventListener('submit', event => {
  event.preventDefault()
  if (nameInput.value) {
    // Emitting name to socket
    socket.emit('new user', nameInput.value)
    document.querySelector('.username').classList.add('displayNone')
    chat.classList.remove('displayNone')
  }
})

// If new user, loop through the users array and display them
socket.on('new user', user => {
  users.innerHTML = ''
  user.map((user) => {
    users.appendChild(Object.assign(document.createElement('li'), { textContent: user + ' has joined! 🥳' }))
  })
})


// Is user disconnects, sending a message with the name of the disconnecting user
socket.on('user leaving', user => {
  users.innerHTML = ''
  user.map((user) => {
    users.appendChild(Object.assign(document.createElement('li'), { textContent: user + ' has joined! 🥳' }))
  })
})


// If starting quiz, show artwork
startButton.addEventListener("click", (e) => {
  e.preventDefault()
  document.querySelector('.start').classList.add('displayNone')
  document.querySelector('.item').classList.remove('displayNone')
})


// When showing artwork, append artwork to html
socket.on('showData', (artData) => {
  document.querySelector('.item > article').innerHTML = ''
  document.querySelector('#answer > input').classList.remove('wrongAnswer')
  document.querySelector('#answer > input').value = ''
  document.querySelector('.item > article').appendChild(Object.assign(document.createElement('p'), { textContent: artData.title }))
  document.querySelector('.item > article').appendChild(Object.assign(document.createElement('img'), { src: artData.image }))
  console.log(artData.title)
  console.log(artData.maker)
})


// If guessing, check if there is input. Then emitting the answer
answerField.addEventListener("submit", (event) => {
  event.preventDefault()
  if (answerInput.value) {
    socket.emit('answer', answerInput.value)
  }
})


// Show alert if answer is correct
socket.on('antwoord', (message) => {
  alert('Het antwoord is geraden! Het antwoord is ' + message.toString())
})

socket.on('wrongAnswer', () => {
  document.querySelector('#answer > input').classList.add('wrongAnswer')
})