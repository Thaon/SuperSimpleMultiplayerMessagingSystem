//load socket.io
var scriptTag = document.createElement("script");
scriptTag.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.slim.js";
document.getElementsByTagName("HEAD")[0].appendChild(scriptTag);

var SSMMS = function(handler, debug)
{

	this.debug = debug;
	this.socket = io('https://ssmms.herokuapp.com');
	this.handler = handler;
	if (this.debug)
		console.log("handler: " + this.handler);

	this.socket.on("info", function(message){
		if (this.debug)
			console.log(message);
	})

	this.CreateRoom = function(roomName, maxPlayers){
		this.socket.emit("create room", roomName, maxPlayers);
	}

	this.JoinRoom = function(roomName){
		this.socket.emit("join room", roomName);
	}

	this.JoinEmptyRoom = function(){
		this.socket.emit("join empty room");
	}

	this.SendMessage = function(type, message){
		this.socket.emit("message", type, message);
	}

	this.socket.on("message", function(type, message){
		if (this.debug)
			console.log("message received: " + {"type": type, "message": message});
	
		this.handler(type, message);
	})
}