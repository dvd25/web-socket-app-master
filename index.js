const express = require('express');
const app = express();

//socket imports below here
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server); //io declared here


app.get('/', (req, res) => {
    console.log("started app.get")
  res.sendFile(__dirname + '/index.html');
});



io.on('connection', (socket) => { //io is a Socket.IO server instance attached to an instance of http.Server listening for incoming events.
    console.log("started io.on connection")
    let totalUser = io.engine.clientsCount;
    socket.on('new user', () => {;
        console.log("started socket new user connection")
        //socket.broadcast.emit('new user', 'new user has joined the chat') //sends to all but the initiating socket
        io.emit('new user', {userCount: totalUser, nickname: null, text: `Hello and welcome to this chat!`}) //send to only the initiating socket
    })


    socket.on('chat message', (msg) => {
        console.log("started socket chat message connection")
        io.emit('chat message', msg); //sends to all connected sockets
    });

    socket.on('choose name', (name) => {
        console.log("started socket choose name connection")
        console.log(totalUser)
        socket.emit('new user', {userCount: totalUser, nickname: name, text: 'has joined the chat'}) //sends to all but the initiating socket
        socket.id = name;
    });    

    socket.on('disconnect', () => {
        console.log("started socket disconect connection")
        totalUser = io.engine.clientsCount;
        io.emit('disconnected', {userCount: totalUser, nickname: socket.id, text: 'has left the chat'}) //sends to all but the initiating socket
        
    })

});  

server.listen(3000, () => {
  console.log('listening on *:3000');
});