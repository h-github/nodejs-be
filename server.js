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

var schema = new mongoose.Schema(
  {
    name: String,
    body: String,
  },
  { collection: "message-logs" }
);

var Message = mongoose.model("Message", schema);

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
      Message.findOne({ body: "badword" }, (err, censored) => {
        if (censored) {
          console.log("censored word found!", censored);
          Message.deleteOne({ _id: censored.id }, err => {
            console.log("removed censored message");
          });
        }
      });
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
