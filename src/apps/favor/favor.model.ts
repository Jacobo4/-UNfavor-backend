let mongoose = require("mongoose");
let Schema = mongoose.Schema;

var FavorSchema = Schema({
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
  reviews: {
    score: Number,
    description: String
  }},
  {collection: "favors"}
);

export default mongoose.model("Favors", FavorSchema);
