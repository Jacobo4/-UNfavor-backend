import { IUser } from "../user/user.model";
import Match from "./match.model";
import {IMatch} from "./match.model";

const matchService = {
    createMatch: async (userA: IUser, userB: IUser): Promise<IMatch> => {
        let test: IMatch = await Match.findOne({ userA_id: userA._id, userB_id: userB._id }).exec();
        
        if(test) return null;

        const data = {
            userA_id: userA._id,
            userB_id: userB._id,
        };

        let match: IMatch = new Match(data);
        const result: IMatch = await match.save();

        if (!result) return null;

        console.log(`Match created: ${result}`);
        return result;
    }
}

export default matchService;
