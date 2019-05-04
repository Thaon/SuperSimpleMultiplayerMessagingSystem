var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var path = require('path');

app.set('port', PORT);
app.use(express.static(__dirname + "static"));

var PORT = process.env.PORT || 3000;

server.listen(PORT, function() {
  console.log('Starting server on ' + PORT);
});

app.get("/", function(req, res){
	res.sendFile(path.join(__dirname, '/static/index.html'));
})

app.get("/api", function(req, res){
	res.sendFile(path.join(__dirname, '/static/SSMMS.js'));
})


//vars-----------------------------------------------------------
var rooms = [];


//messages-----------------------------------------------------------
io.on("connection", function(socket){
	socket.emit("info", "Welcome to the SSMMS server!");
	console.log("user connected: " + socket.id);
})

io.on("disconnect", function(socket){
	console.log("user disconnected: " + socket.id);

	//check if the room this socket was in is empty and remove it
	rooms.forEach(function(room){
		if (room.players.includes(socket.id))
			room.players.pop(socket.id);

		if(rooms.players.length == 0)
			rooms.pop(room);
	})
})

io.on("create room", function(socket, roomName, maxPlayers){
	//create a new room if it's possible
	var tRoom = null;

	rooms.forEach(function(room){
		if (room.name == roomName)
			tRoom = room;
	})

	if(tRoom == null)
	{
		var tempRoom = {"name":roomName, "maxPlayers":maxPlayers, "players":[]}
		tempRoom.players.push(socket);
		tRoom.push(tempRoom);
		socket.emit("info", "Room has been created!");
	}
	else
		socket.emit("info", "Sorry but a room with the same name already exists");
})

io.on("join room", function(socket, roomName){
	//join an existing room
	var tRoom = null;

	rooms.forEach(function(room){
		if (room.name == roomName)
			tRoom = room;
	})

	if(tRoom == null)
	{
		socket.emit("info", "Sorry, The room you are looking for does not exist :/");
	}
	else
	{
		if (tRoom.players.length < tRoom.maxPlayers)
		{
			tRoom.players.push(socket);
			socket.emit("info", "The room has been joined successfully!");
			
		}
		socket.emit("info", "Sorry but a room with the same name already exists");
	}
})

io.on("join empty room", function(socket){
	//find a random room to join that is not full
	rooms.forEach(function(room){
		if (room.players.length < room.maxPlayers)
		{
			tRoom.players.push(socket);
			socket.emit("info", "The first empty room has been joined successfully!");
		}
	})
})

io.on("message", function(socket, type, payload){
	//rely a message to all sockets in the same room
	var tRoom = null;

	rooms.forEach(function(room){
		if (room.players.includes(socket.id))
			tRoom = room;
	})

	if (tRoom != null)
	{
		tRoom.players.forEach(function(tsocket)
		{
			if (socket.id != tsocket.id)
				tsocket.emit("message", type, payload);
		})
	}
})