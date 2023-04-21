var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const textSchema = new Schema({datetime: Date, text: String})

var chatSchema = Schema({
  entries: [textSchema]
  },
  {collection: "chats"}
);

module.exports = mongoose.model("DataBase", chatSchema);
