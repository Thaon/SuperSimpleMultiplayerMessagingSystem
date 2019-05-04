//load socket.io
var scriptTag = document.createElement("SocketIO");
scriptTag.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.slim.js";
location.appendChild(scriptTag);

var SSMMS = function()
{
	this.socket = io();

	this.socket.on("info", function(message){
		console.log(message);
	})

	this.CreateRoom = function(roomName){
		
	}
}