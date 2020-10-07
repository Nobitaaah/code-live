const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const config = require('config');
const users = require("./routes/api/users");
const { remove } = require('./models/User');

const port = process.env.PORT || 5000;

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const db = require("./config/keys").mongoURI;
const db = config.get('CodeLive.dbConfig.uri');

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


var rooms = []
var removeRooms = []

function removingRooms() {

    console.log("ROOMS: " + rooms)
    if (removeRooms.length != 0) {
        for (let i = 0; i < removeRooms.length; i++) {
            if (io.sockets.adapter.rooms[removeRooms[i]] === undefined) {
                rooms = rooms.filter(function (item) {
                    return item !== removeRooms[i]
                })
            }
        }
    }
    removeRooms.splice(0,removeRooms.length)

    setTimeout(removingRooms, 60 * 60 * 1000);
}


// Triggered whenever a user joins and websocket
// handshake is successfull
io.on("connection", (socket) => {
    // ID of the user connected
    const { id } = socket.client
    console.log(`User connected ${id}`)

    // Check if room exists
    socket.on('room-id', msg => {
        let exists = rooms.includes(msg)
        socket.emit('room-check', exists)

    })

    // If code changes, broadcast to sockets
    socket.on('code-change', msg => {
        socket.broadcast.to(socket.room).emit('code-update', msg)

    })

    // Send initial data to last person who joined
    socket.on('user-join', msg => {
        let room = io.sockets.adapter.rooms[socket.room]
        let lastPerson = Object.keys(room.sockets)[room.length - 1]
        io.to(lastPerson).emit('accept-info', msg);
    })

    // Add room to socket
    socket.on('join-room', msg => {
        console.log("JOINING " + msg)
        socket.room = msg
        socket.join(msg)
        let room = io.sockets.adapter.rooms[socket.room]
        if (room.length > 1) {
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

    // If title changes, broadcast to sockets
    socket.on('title-change', msg => {
        io.sockets.in(socket.room).emit('title-update', msg)
    })

    // If connection is lost
    socket.on('disconnect', () => {
        console.log(`User ${id} disconnected`)
    })

    // Check if there is no one in the room, remove the room if true
    socket.on('disconnecting', () => {
        try {
            let room = io.sockets.adapter.rooms[socket.room]
            io.sockets.in(socket.room).emit('joined-users', room.length - 1)
            if (room.length === 1) {
                console.log("Leaving Room " + socket.room)
                socket.leave(socket.room)
                removeRooms.push(socket.room)
            }
        }
        catch (error) {
            console.log("Disconnect error")
        }
    })
});

removingRooms()

server.listen(port, () => console.log(`Listening on port ${port}`))