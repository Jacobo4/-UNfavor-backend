var mongoose = require("mongoose");
var Schema = mongoode.Schema;

var ChatSchema = Schema({

  },
  {collection: "chats"}
);

module.exports = mongoose.model("DataBase", ChatSchema);
