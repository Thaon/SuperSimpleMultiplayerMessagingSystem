//load socket.io
var scriptTag = document.createElement("script");
scriptTag.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.slim.js";
document.getElementsByTagName("HEAD")[0].appendChild(scriptTag);

var SSMMS = function(handler, gotRooms, debug)
{

	this.debug = debug;
	this.handler = handler;
	this.RoomsReceived = gotRooms;

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
		
			proxy.handler(type, message);
		})

		proxy.socket.on("rooms", function(SrvRooms)
		{
			proxy.RoomsReceived(SrvRooms);
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

	this.SendMessage = function(type, message){
		this.socket.emit("message", type, message);
	}
}