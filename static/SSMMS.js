//load socket.io
var scriptTag = document.createElement("script");
scriptTag.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.slim.js";
document.getElementsByTagName("HEAD")[0].appendChild(scriptTag);

var SSMMS = function(debug)
{

	this.debug = debug;
	this.onMessage = function() {
		if(this.debug)
			debug.log("A message has been received");
	};
	this.onRoomsReceived = function() {
		if(this.debug)
			debug.log("The rooms list has been received");
	};
	this.onUserDisconnected = function() {
		if(this.debug)
			debug.log("A player has disconnected");
	}

	this.Connect = function(proxy)
	{
		proxy.socket = io('https://ssmms.herokuapp.com');

		proxy.socket.on("info", function(message){
			if (proxy.debug)
				console.log(message);
		})

		proxy.socket.on("message", function(type, message){
			if (proxy.debug)
				console.log("message received: " + {"type": type, "message": message});
		
			proxy.onMessage(type, message);
		})

		proxy.socket.on("rooms received", function(SrvRooms)
		{
			if (proxy.debug)
				console.log("Received a list of rooms");

			proxy.onRoomsReceived(SrvRooms);
		})

		proxy.socket.on("user disconnected", function(){
			if (proxy.debug)
				console.log("Received a list of rooms");

			proxy.onUserDisconnected();			
		})
	}

	this.GetRooms = function(){
		this.socket.emit("get rooms");
	}

	this.CreateRoom = function(roomName, maxPlayers){
		this.socket.emit("create room", roomName, maxPlayers);
	}

	this.JoinRoom = function(roomName){
		this.socket.emit("join room", roomName);
	}

	this.JoinEmptyRoom = function(){
		this.socket.emit("join empty room");
	}

	this.LeaveRoom = function(roomName){
		this.socket.emit("leave room", roomName);
	}

	this.SendMessage = function(type, message){
		this.socket.emit("message", type, message);
	}
}