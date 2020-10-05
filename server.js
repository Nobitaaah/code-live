const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users")

const port = process.env.PORT || 5000;

const app = express()


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(passport.initialize());
require("./config/passport")(passport);
app.use("/api/users", users);


const server = http.createServer(app)
// Create a socketIO server
const io = socketIO(server, { path: '/sockets' })

var usernames = {}

var rooms = []

// Triggered whenever a user joins and websocket
// handshake is successfull
io.on("connection", (socket) => {
    // ID of the user connected
    const { id } = socket.client
    console.log(`User connected ${id}`)

    socket.on('room-id', msg => {
        let exists = rooms.includes(msg)
        socket.emit('room-check', exists)

    })

    // If code changes, broadcast to sockets
    socket.on('code-change', msg => {
        io.sockets.in(socket.room).emit('code-update', msg)

    })

    socket.on('user-join', msg => {
        let room = io.sockets.adapter.rooms[socket.room]
        let lastPerson = Object.keys(room.sockets)[room.length - 1]
        io.to(lastPerson).emit('accept-info', msg);
    })

    socket.on('join-room', msg => {
        console.log("JOINING " + msg)
        socket.room = msg
        socket.join(msg)
        let room = io.sockets.adapter.rooms[socket.room]
        if (room.length>1) {
            console.log("sending")
            let user = Object.keys(room.sockets)[0]
            io.to(user).emit('request-info', "");
        }
        io.sockets.in(socket.room).emit('joined-users', room.length)
    })

    socket.on('created-room', msg => {
        console.log("CREATED-ROOM " + msg)
        rooms.push(msg)
    })


    // If language changes, broadcast to sockets
    socket.on('language-change', msg => {
        io.sockets.in(socket.room).emit('language-update', msg)
    })

    socket.on('title-change', msg => {
        io.sockets.in(socket.room).emit('title-update', msg)
    })

    // If connection is lost
    socket.on('disconnect', () => {
        console.log(`user ${id} disconnected`)
    })

    socket.on('disconnecting', () => {
        try {
            let room = io.sockets.adapter.rooms[socket.room]
            io.sockets.in(socket.room).emit('joined-users', room.length-1)
        }
        catch(error) {
            console.log("Disconnect error")
        }

    })

});

server.listen(port, () => console.log(`Listening on port ${port}`))