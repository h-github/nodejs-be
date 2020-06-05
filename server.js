var express = require("express");
var bodyParser = require("body-parser");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require("mongoose");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbName = "messages";
const dbUrl = `mongodb+srv://primary-user:vG95bq9mOuLcXzVH@messaging-5pcyh.mongodb.net/${dbName}`;

var Message = mongoose.model(
  "Message",
  {
    name: String,
    body: String,
  },
  "message-logs"
);

io.on("connection", socket => {
  console.log("A user connected...");
});

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  var newMessage = new Message(req.body);

  newMessage
    .save()
    .then(msg => {
      res.sendStatus(200);
      io.emit("message", newMessage);
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

mongoose.connect(
  dbUrl,
  { useUnifiedTopology: true, useNewUrlParser: true },
  err => console.log("Mongodb connection", err)
);
var server = http.listen(3000, () =>
  console.log(`Server is loaded on port ${server.address().port}`)
);
