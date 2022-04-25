const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4242
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

require('dotenv').config({path: '.env-dev'})

const {
  API_KEY
} = process.env

app.use(express.static(path.resolve('public')))


io.on('connection', (socket) => {
  let name
  socket.on('new user', (username) => {
    name = username
    io.emit("message", `${username} has joined the chat! 🥳`)
  })

  socket.on('newImage', (randomMaker) => {
    io.emit("newImage", randomMaker)
  })


  socket.on('message', (message) => {
    io.emit('message', `${name}: ${message}`)
  })

  socket.on('disconnect', () => {
    io.emit('message', `${name} disconnected 😔`)
  })
})

http.listen(port, () => {
  console.log('Active on port ' + port)
})