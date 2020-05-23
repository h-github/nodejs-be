var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = http.listen(9300, () => {
  console.log("server is listening to port", server.address().port);
});

var messages = [
  { name: "Hamid", body: "Hi!" },
  { name: "Artin", body: "Hi there!" },
];

app.get("/messages", (req, res) => {
  res.send(messages);
});

io.on("connection", socket => {
  console.log("A user connected...");
});

app.post("/messages", (req, res) => {
  messages.push(req.body);
  io.emit("message", req.body);
  res.send(200);
});
