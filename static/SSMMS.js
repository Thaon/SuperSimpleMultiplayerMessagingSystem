//load socket.io
var scriptTag = document.createElement("script");
scriptTag.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.slim.js";
document.getElementsByTagName("HEAD")[0].appendChild(scriptTag);

var SSMMS = function(handler, debug)
{

	this.debug = debug;
	this.socket = io('https://ssmms.herokuapp.com', {autoConnect: true});
	this.handler = handler;
	if (this.debug)
		console.log("handler: " + handler);

	this.socket.on("info", function(message){
		if (this.debug)
			console.log(message);
	})

	this.CreateRoom = function(roomName, maxPlayers){
		SSMMS.socket.emit("create room", SSMMS.socket, roomName, maxPlayers);
	}

	this.JoinRoom = function(roomName){
		SSMMS.socket.emit("join room", SSMMS.socket, roomName);
	}

	this.JoinEmptyRoom = function(){
		SSMMS.socket.emit("join empty room", SSMMS.socket);
	}

	this.SendMessage = function(type, message){
		SSMMS.socket.emit("message", SSMMS.socket, type, message);
	}

	this.socket.on("message", function(type, message){
		if (SSMMS.debug)
			console.log("message received: " + {"type": type, "message": message});
	
		SSMMS.handler(type, message);
	})
}