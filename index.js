var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io"(server));

server.listen(80);

app.get("/", function(req, res){
	res.send(/socket.io/socket.io.js);
})

var rooms = [];


io.on("connection", function(socket){
	socket.emit("info", rooms);
	console.log("user connected: " + socket.id);
})