var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var path = require('path');

app.set('port', PORT);
app.use("/static", express.static(__dirname + "static"));
app.use("/css", express.static(__dirname + "static/css"));
app.use("/font", express.static(__dirname + "static/font"));
app.use("/js", express.static(__dirname + "static/js"));


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


function CleanRooms()
{
	//check if the room this socket was in is empty and remove it
	if (rooms.length > 0)
	{
		rooms.forEach(function(room){
			room.players.forEach(function(player){
				if (!player.connected)
				{
					room.pop(player);
				}
			})

			if(room.players.length == 0)
			{
				console.log("Cleaned up room " + room.name);
				rooms.pop(room);
			}
		})
	}
}

setInterval(CleanRooms, 5000);

//vars-----------------------------------------------------------
var rooms = [];


//messages-----------------------------------------------------------
io.on("connection", function(socket){
	socket.emit("info", "Welcome to the SSMMS server!");
	console.log("user connected: " + socket.id);

	socket.on("disconnect", function(){
		console.log("user disconnected: " + socket.id);

		//check if the room this socket was in is empty and remove it
		rooms.forEach(function(room){
			if (room.players.includes(socket))
			{
				console.log("Player was removed from room");
				room.players.pop(socket);

				room.players.forEach(function(player){
					player.emit("user disconnected");
				})
			}

			if(room.players.length == 0)
			{
				console.log("The room was empty, bye bye room");
				rooms.pop(room);
			}
		})

		console.log("Rooms available now: " + rooms.length);
	})

	socket.on("get rooms", function(){
		var rms = [];

		console.log("Rooms requested, sending back " + rooms.length + " rooms");

		rooms.forEach(function(tRoom){
			console.log(tRoom.name + " - " + tRoom.maxPlayers);
			rms.push({"name":tRoom.name, "currentPlayers":tRoom.players.length, "maxPlayers":tRoom.maxPlayers});
		})
		socket.emit("rooms received", rms);
		console.log("Sent!");
	})

	socket.on("create room", function(roomName, maxPlayers){
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
			rooms.push(tempRoom);
			socket.emit("info", "Room has been created!");
			console.log("Room created " + tempRoom);
		}
		else
		{
			socket.emit("info", "Sorry but a room with the same name already exists");
			socket.emit("error", "CNC", "could not create room");
		}
	})

	socket.on("join room", function(roomName){
		//join an existing room
		var tRoom = null;

		rooms.forEach(function(room){
			if (room.name == roomName)
				tRoom = room;
		})

		if(tRoom == null)
		{
			socket.emit("error", "CNJ", "could not join room, room does not exist");
			socket.emit("info", "Sorry, The room you are looking for does not exist :/");
		}
		else
		{
			if (tRoom.players.length < tRoom.maxPlayers)
			{
				tRoom.players.push(socket);
				socket.emit("info", "The room has been joined successfully!");
			}
			else
			{
				socket.emit("error", "CNJ", "could not join room, room is full");
				socket.emit("info", "Sorry but the room is full :/");
			}
		}
	})

	socket.on("join empty room", function(){
		//find a random room to join that is not full
		var tRoom = null;
		rooms.forEach(function(room){
			if (room.players.length < room.maxPlayers)
			{
				tRoom = room;
				tRoom.players.push(socket);
				socket.emit("info", "The first empty room has been joined successfully!");
			}
		})

		if (tRoom == null)
		{
			socket.emit("error", "CNJ", "could not join room, no empty room available");
			socket.emit("info", "Sorry but there is no empty room available :/");
		}
	})

	socket.on("leave room", function(roomName){
		//check if the room this socket was in is empty and remove it
		rooms.forEach(function(room){
			if (room.name == roomName && room.players.includes(socket))
			{
				socket.emit("info", "The room was left successfully");
				room.players.pop(socket);
			}

			if(room.players.length == 0)
				rooms.pop(room);
		})
	})

	socket.on("message", function(type, payload){
		//rely a message to all sockets in the same room
		var tRoom = null;

		rooms.forEach(function(room){
			if (room.players.includes(socket))
				tRoom = room;
		})

		if (tRoom != null)
		{
			tRoom.players.forEach(function(tsocket)
			{
				if (socket != tsocket)
					tsocket.emit("message", type, payload);
			})
		}
	})

})