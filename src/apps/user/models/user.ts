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
    user_favors:[Schema.Types.ObjectId],
    preferences: {
      favor_filters: {
        favor_type: {type: String, default: "Any"},
        favor_date: {type: Date, default: new Date(2020, 0, 1)},
        max_distance_km: {type: Number, default: 50},
        min_price_usd: {type: mongoose.Decimal128}
      }
    }
}, {collection: "users"});

export default mongoose.model("Users", UserSchema);//Nombre de la coleccion de la DB
