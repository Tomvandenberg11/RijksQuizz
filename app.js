const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4242

app.use(express.static(path.resolve('public')))

io.on('connection', (socket) => {
  let name
  socket.on('new user', (username) => {
    name = username
    io.emit("new user", `${username} has joined the chat!`)
  })

  socket.on('message', (message) => {
    io.emit('message', `${name}: ${message}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

http.listen(port, () => {
  console.log('Active on port ' + port)
})