var express = require("express");
var server = require("http").Server(app);
var io = require("socket.io")(server);

var app = express();
app.use(express.static("static"))

server.listen(3000);
console.log("Listening on port 3000");

app.get("/", function(req, res){
	 res.sendFile('/static/SSMMS.js', (err) => {
    res.end();

    if (err) throw(err);
  });
})


//vars-----------------------------------------------------------
var rooms = [];


//messages-----------------------------------------------------------
io.on("connection", function(socket){
	socket.emit("info", "Welcome to the SSMMS server!");
	console.log("user connected: " + socket.id);
})

io.on("disconnect", function(socket){
	//check if the room this socket was in is empty and remove it
	rooms.forEach(function(room){
		if (room.players.includes(socket))
			room.players.pop(socket);

		if(rooms.players.length == 0)
			rooms.pop(room);
	})

	console.log("user disconnected: " + socket.id);
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
		if (room.players.includes(socket))
			tRoom = room;
	})

	if (tRoom != null)
	{
		tRoom.players.forEach(function(socket)
		{
			socket.emit("message", type, payload);
		})
	}
})