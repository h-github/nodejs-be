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

app.post("/messages", async (req, res) => {
  try {
    var newMessage = new Message(req.body);

    var savedMessage = await newMessage.save();

    console.log("message saved", savedMessage);

    var censored = await Message.findOne({ body: "badword" });

    if (censored) await Message.deleteOne({ _id: censored.id });
    else io.emit("message", newMessage);

    res.sendStatus(200);

    //end of try
  } catch (error) {
    res.sendStatus(500);
    return console.error(error);
  } finally {
    console.log("message post called");
  }
});

mongoose.connect(
  dbUrl,
  { useUnifiedTopology: true, useNewUrlParser: true },
  err => console.log("Mongodb connection", err)
);
var server = http.listen(3000, () =>
  console.log(`Server is loaded on port ${server.address().port}`)
);
