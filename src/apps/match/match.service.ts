import Match from "./match.model";
import {IMatch} from "./match.model";

const matchService = {
    createMatch: async (favorA, favorB) => {
        let test = await Match.findOne({ favorA_id: favorA._id, favorB_id: favorB._id }).exec();
        if(test) return null;
        const data = {
            favorA_id: favorA._id,
            userA_id: favorA.user_published_id,
            userB_id: favorB.user_published_id,
            favorB_id: favorB._id,
        };
        let match: IMatch = new Match(data);
        const result = await match.save();
        if (!result) return null;
        console.log(`Match created: ${result}`);
        return result;
    },

    matchExists: async (favorA, favorB) => {
        return await Match.findOne({ favorA_id: favorA._id, favorB_id: favorB._id }).exec();
    }
}

export default matchService;