var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const UserSchema = Schema({
	username: String,
    name: String,
    email: String,
    phone: String,
    age: Number,
    user_reviews_num: Number,
    user_reviews_sum: Number,
    user_favors:[Schema.Types.ObjectId]
}, {collection: "users"});

module.exports = mongoose.model("DataBase", UserSchema);//Nombre de la coleccion de la DB