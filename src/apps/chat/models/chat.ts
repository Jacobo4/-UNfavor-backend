var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const textSchema = new Schema({datetime: Date, text: String})

var chatSchema = Schema({
  entries: [textSchema]
  },
  {collection: "chats"}
);

export default mongoose.model("Chats", chatSchema);
