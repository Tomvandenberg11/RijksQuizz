const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4242
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

require('dotenv').config({path: '.env-dev'})

app.use(express.static(path.resolve('public')))

const {
  API_KEY
} = process.env

const getData = endpoint => {
  return fetch(endpoint)
    .then(res => res.json())
    .catch(_ => null)
}

const artists = ['Frans Hals', 'Johannes Vermeer', 'Aelbert Cuyp', 'Rembrandt van Rijn', 'Jan Both', 'Vincent van Gogh']

const filterData = async () => {
  const endpoint = `https://www.rijksmuseum.nl/api/nl/collection?key=${API_KEY}&ps=100&imgonly=true&toppieces=true`
  const data = await getData(endpoint)
  return data.artObjects.filter(artObject => {
    return artists.includes(artObject.principalOrFirstMaker)
  })
}

filterData()
  .then(() => console.log('Filtering data'))

let sortedData

const sortData = async () => {
  const data = await filterData()
  const sortingData = data.sort(() => .5 - Math.random())

  sortedData = sortingData

  return sortedData
}

let randomArt

sortData()
  .then(() => console.log('loading the data..'))
  .then(() => randomArt = sortedData[Math.floor(Math.random()*sortedData.length)])
  .catch((err) => console.log(err))


io.on('connection', (socket) => {
  let name
  const allUsers = []

  socket.on('new user', (username) => {
    name = username
    allUsers.push(name)

    io.emit("new user", `${username} has joined! 🥳`)
  })

  let artData = {
    text: randomArt.title,
    image: randomArt.webImage.url,
    maker: randomArt.principalOrFirstMaker
  }
  io.emit('showData', artData)

  socket.on('disconnect', () => {
    // io.emit('message', `${name} disconnected 😔`)
    console.log(name + ' disconnected')
  })
})

http.listen(port, () => {
  console.log('Active on port ' + port)
})