import mongoose from "mongoose";

const User = require("../../models/user");

var favorFilters = {
  changeFavorFilters: async function (req, res) {
    const userId = req.user.id;

    User.findById(userId, (err, user) => {
      if(err){
        return res.status(500).send({
          message: "Error Finding User"
        });
      }

      if(!user){
        return res.status(404).send({
          message: "Couldn't find user"
        });
      }
      
      user.preferences.favor_filters.favor_type = req.body.favor_type;
      user.preferences.favor_filters.favor_date = req.body.date;
      user.preferences.favor_filters.max_distance_km = req.body.max_distance_km;
      user.preferences.favor_filters.min_price_usd = req.body.min_price_usd;

      user.save((err, updateUser) => {
        if(err){
          return res.status(500).send({
            message: "No Fucking Clue Error"
          });
        }

        res.send("Updated Succesfully");
      });
    });
  },
  getFavorFilters: async function(req, res){
    const userId = req.user.id;

    User.findById(userId, (err, user) => {
      if(err){
        return res.status(500).send({
          message: "Error finding user"
        });
      }

      if(!user){
        return res.status(404).send({
          message: "User not found"
        });
      }

      const favor_filters = {
        favor_type: user.preferences.favor_filters.favor_type,
        favor_date: user.preferences.favor_filters.favor_date,
        max_distance_km: user.preferences.favor_filters.max_distance_km,
        min_price_usd: user.preferences.favor_filters.min_price_usd
      };

      res.json(favor_filters);
    });
  }
}
