var mongoose = require("mongoose");
var Schema = mongoode.Schema;

const textSchema = new Schema({datetime: Date, text: String})

var chatSchema = Schema({
  entries: [textSchema]
  },
  {collection: "chats"}
);

module.exports = mongoose.model("DataBase", ChatSchema);
