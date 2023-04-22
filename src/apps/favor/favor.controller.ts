import userService from "../user/user.service";
import favorService from "./favor.service";

const favor = {
    getFavors: async function (req, res) {
        const userId = req.user.id;
        let user, favors;
        try{
            user = await userService.getUser(userId);
            favors = await favorService.getAll();
        }catch(error){
            console.log("ERROR: ", error.message);
            return res.status(401).send({ message: error.message, error });
        }
        let filters = user.preferences.favor_filters;
        if(!filters) return res.status(404).send({message: "User preferences error"});
        /*
        const favors = await Favor.find({date_published: {$gte: filters.favor_date},
                                        price: {$gte: filters.min_price_usd},}).exec();
                                        //location: {$near: {$geometry: {type: "Point", coordinates: [req.user.location.coordinates[0], req.user.location.coordinates[1]]}, $maxDistance: filters.max_distance_km * 1000}}});
        */
        res.status(200).send({
            message: "Favors found",
            favors: favors,
        });
    },
}

export default favor;