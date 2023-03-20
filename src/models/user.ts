var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: String,
    age: Number,
    user_reviews_num: Number,
    user_reviews_sum: Number,
    user_favors:[Schema.Types.ObjectId]
}, {collection: "users"});

module.exports = mongoose.model("DataBase", UserSchema);//Nombre de la coleccion de la DB