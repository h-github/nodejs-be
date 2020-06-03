class Message {
  constructor(name, body) {
    this.name = name;
    this.body = body;
  }

  deserialize(input) {
    this.name = input.name;
    this.body = input.body;

    return this;
  }
}

module.exports = Message;
