var SSMMS = function(handler, debug)
{
	//load socket.io
	var scriptTag = document.createElement("SocketIO");
	scriptTag.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.slim.js";
	
	this.debug = debug;
	this.socket = io("https://ssmms.herokuapp.com:3000");

	this.socket.on("info", function(message){
		if (this.debug)
			console.log(message);
	})

	this.CreateRoom = function(roomName, maxPlayers){
		this.socket.emit("create room", this.socket, roomName, maxPlayers);
	}

	this.JoinRoom = function(roomName){
		this.socket.emit("join room", this.socket, roomName);
	}

	this.JoinEmptyRoom = function(){
		this.socket.emit("join empty room", this.socket);
	}

	this.SendMessage = function(type, message){
		this.socket.emit("message", this.socket, type, message);
	}

	this.socket.on("message", function(type, message){
		handler(type, message);
	})
}