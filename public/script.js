let socket = io()
let ul = document.querySelector('section ul')
let input = document.querySelector('input')
const nameContainer = document.querySelector('.username')
const chat = document.querySelector('section:last-of-type')
const chatForm = document.querySelector('.chatForm')
const chatText = document.querySelector('#chatText')

const apiUrl = `https://www.rijksmuseum.nl/api/nl/collection?key=tn2lRhSP&ps=1&imgonly=true`

let randomMaker
let randomPainting

// FETCHING THE DATA
fetch(apiUrl)
  .then((data) => data.json())
  // .then((data) => console.log(data.artObjects[0].principalOrFirstMaker))
  .then((data) => {
    randomMaker = data.artObjects[0].principalOrFirstMaker
    randomPainting = data.artObjects[0].webImage.url
  })
  .catch((error) => console.log(error))
  .finally(() => console.log("Data loaded"))

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
  if (chatText.value) {
    socket.emit('nextPainting', chatText.value)
    chatText.value = ''
  }
  ul.appendChild(Object.assign(document.createElement('li'), { textContent: randomMaker }))
  ul.appendChild(Object.assign(document.createElement('img'), { src: randomPainting }))

})

socket.on('nextPainting', randomMaker => {
  ul.appendChild(Object.assign(document.createElement('li'), { textContent: randomMaker }))
  ul.scrollTop = ul.scrollHeight
})

