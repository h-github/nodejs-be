var Message = require("./message");
var express = require("express");
var bodyParser = require("body-parser");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = http.listen(3000, () =>
  console.log(`Server is loaded on port ${server.address().port}`)
);

var msg1 = new Message("Hamid", "Hi!");
var msg2 = new Message("Artin", "Hi there!");
var messages = [msg1, msg2];

io.on("connection", socket => {
  console.log("A user connected...");
});

app.get("/messages", (req, res) => {
  res.send(messages);
});

app.post("/messages", (req, res) => {
  var newMessage = new Message().deserialize(req.body);
  messages.push(newMessage);
  res.sendStatus(200);
  io.emit("message", newMessage);
});
