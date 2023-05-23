import { IUser } from "../user/user.model";
import Match from "./match.model";
import {IMatch} from "./match.model";
import favorService from "../favor/favor.service";

const matchService = {

    getFinishedMatches: async (userId, status): Promise<IMatch[]> => {
        let asUserA: IMatch[] = await Match.find({userA_id: userId, status: status}).exec();
        let asUserB: IMatch[] = await Match.find({userB_id: userId, status: status}).exec();
        let matches = [];
        for(let match of asUserA){
          let info: any = JSON.parse(JSON.stringify(await favorService.getFavorInfo(match.userB_id)));
          if(status != 'FINISHED'){
            info.date = match.date_completed;
            info.status = match.status;
          }
          matches.push(info);
        }
        for(let match of asUserB){
          let info: any = JSON.parse(JSON.stringify(await favorService.getFavorInfo(match.userA_id)));
          if(status != 'FINISHED'){
            info.date = match.date_completed;
            info.status = match.status;
          }
          matches.push(info);
        }

        return matches;
    },

    createMatch: async (userA: IUser, userB: IUser): Promise<IMatch> => {
        let test: IMatch = await Match.findOne({ userA_id: userA._id, userB_id: userB._id }).exec();
        if(!test) test =  await Match.findOne({ userA_id: userB._id, userB_id: userA._id }).exec();
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
