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
    user_favors: [Schema.Types.ObjectId],
    favor: {
        user_published_id: mongoose.ObjectId,
        date_published: Date,
        title: String,
        description: String,
        category: String,
        location: String,
        chat_id: mongoose.ObjectId,
        rank: {type: Number, default: 0},
    },
    preferences: {
      favor_filters: {
        favor_type: {type: String, default: "Any"},
        max_distance_km: {type: Number, default: 50},
      }
    }
}, {collection: "users"});

export default mongoose.model("Users", UserSchema);//Nombre de la coleccion de la DB
