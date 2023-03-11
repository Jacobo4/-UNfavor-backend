var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
    age: Number,
    phone: String,
    email: String,
}, {collection: "users"});

module.exports = mongoose.model("DataBase", UserSchema);//Nombre de la coleccion de la DB