import User from '../../user/models/user';

const favorFilters = {
  changeFavorFilters: async function (req, res) {
    const userId = req.user.id;

    const user = await User.findById(userId).exec();
    if (!user) return res.status(404).send({ message: "Couldn't find user" });

    user.preferences.favor_filters.favor_type = req.body.favor_type;
    user.preferences.favor_filters.favor_date = req.body.date;
    user.preferences.favor_filters.max_distance_km = req.body.max_distance_km;
    user.preferences.favor_filters.min_price_usd = req.body.min_price_usd;

    const result = user.save()
    if(!result){
      return res.status(500).send({
        message: "No Fucking Clue Error"
      });
    }

    res.send("Updated Succesfully");

  },

  getFavorFilters: async function(req, res){
    const userId = req.user.id;

    const user = await User.findById(userId).exec();
    if (!user) return res.status(404).send({ message: "User not found" });

    const favor_filters = {
      favor_type: user.preferences.favor_filters.favor_type,
      favor_date: user.preferences.favor_filters.favor_date,
      max_distance_km: user.preferences.favor_filters.max_distance_km,
      min_price_usd: user.preferences.favor_filters.min_price_usd
    };

    res.json(favor_filters);

  }
}

export default favorFilters;
