var mongoose = require("mongoose");
var Schema = mongoode.Schema;

var FavorSchema = Schema(
  user_published_id: mongoose.ObjectId,
  user_accepted_id: mongoose.ObjectId,
  date_published: Date,
  date_accepted: Date,
  date_completed: Date,
  favor_state: String,
  title: String,
  description: String,
  category: String,
  price: mongoose.Decimal128,
  location: String,
  chat_id: mongoose.ObjectId,
  revews: {
    score: Number,
    descrpition: String
  }
)
