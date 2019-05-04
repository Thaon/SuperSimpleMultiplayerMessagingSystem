var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io"(server));

server.listen(80);

app.get("/", function(req, res){
	res.send(/SSMMS.js);
})

var rooms = [];


io.on("connection", function(socket){
	socket.emit("info", "Welcome to the SSMMS server!");
	console.log("user connected: " + socket.id);
})

io.on("disconnect", function(socket){
	//check if the room this socket was in is empty and remove it
	console.log("user disconnected: " + socket.id);
})

io.on("create room", function(roomName, maxPlayers){

})

io.on("join room", function(socket, roomName){
	//join an existing room
})

io.on("join random room", function(socket){
	//find a random room to join that is not full
})

io.on("message", function(socket, type, payload){
	//rely a message to all sockets in the same room

})