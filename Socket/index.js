const app = require('express')();
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {cors: {
    origin: "*",
    methods: ["GET", "POST"]
}});


io.on('connection', (socket) => {
  
    console.log('New connection')

    socket.on('message', function (msg) {
        io.sockets.sockets.forEach(s => {
            if (s.id !== socket.id) {
                s.emit('message', msg)
            }
        })
        console.log(msg)
    })

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
