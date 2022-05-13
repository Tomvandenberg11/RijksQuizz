const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4242
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

require('dotenv').config({path: '.env-dev'})

app.use(express.static(path.resolve('public')))


// Artists which artworks are being used for the quiz
const artists = ['Frans Hals', 'Johannes Vermeer', 'Aelbert Cuyp', 'Rembrandt van Rijn', 'Jan Both', 'Vincent van Gogh']

const {
  API_KEY
} = process.env


// Setting up global variables
const allUsers = []
let artData
let sortedData
let painting = 0


// Receiving data from API
const getData = endpoint => {
  return fetch(endpoint)
    .then(res => res.json())
    .catch(_ => null)
}


// Filtering data from API
const filterData = async () => {
  const endpoint = `https://www.rijksmuseum.nl/api/nl/collection?key=${API_KEY}&ps=100&imgonly=true&toppieces=true`
  const data = await getData(endpoint)
  return data.artObjects.filter(artObject => {
    return artists.includes(artObject.principalOrFirstMaker)
  })
}

filterData()
  .then(() => console.log('Filtering data'))


// Picking artworks from the painters
const sortData = async () => {
  const data = await filterData()
  const sortingData = data.sort(() => .5 - Math.random())

  sortedData = sortingData

  return sortedData
}


// Picking a random artworks
sortData()
  .then(() => console.log('Loading the data..'))
  .then(() => {
    artData = {
      title: sortedData[painting].title,
      image: sortedData[painting].webImage.url,
      maker: sortedData[painting].principalOrFirstMaker
    }
  })
  .catch((err) => console.log(err))


// Setting up Socket connection
io.on('connection', (socket) => {


  // Global variable for connecting name
  let name
  io.emit("new user", allUsers)


  // If new user connects, pushing name to allUsers array and emitting "new user"
  socket.on('new user', (username) => {
    name = username
    allUsers.push(name)
    io.emit("new user", allUsers)
  })


  // Emitting artwork
  io.emit('showData', artData)


  // If guessing, filtering answer and guess to lowercase to validate
  socket.on('answer', (answer) => {
    const artist = artData.maker
    const goodAnswer = artData.maker.toLowerCase()
    const guess = answer.toLowerCase()


    // If guess is correct, emmit "antwoord"
    if (guess.includes(goodAnswer)) {
      io.emit("antwoord", artist)

      painting = painting + 1
      artData = {
        title: sortedData[painting].title,
        image: sortedData[painting].webImage.url,
        maker: sortedData[painting].principalOrFirstMaker
      }
      io.emit('showData', artData)
    } else {
        io.emit('wrongAnswer')
    }
  })


  // Emitting if user disconnects and removing name from array
  socket.on('disconnect', () => {
    io.emit("user leaving", name)
    allUsers.splice(name)
  })
})

http.listen(port, () => {
  console.log('Active on port ' + port)
})