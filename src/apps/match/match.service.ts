import { IUser } from "../user/user.model";
import Match from "./match.model";
import {IMatch} from "./match.model";
import favorService from "../favor/favor.service";
import {ObjectId} from "mongoose";

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

    acceptMatch: async(userId: ObjectId, matchId: ObjectId) => {
      let match:IMatch = await Match.findById(matchId).exec();
      if(!match) throw new Error("Match doesn't exist");
      if(userId.toString() == match.userA_id.toString()) match.userA_confirmation = true;
      else if(userId.toString() == match.userB_id.toString()) match.userB_confirmation = true;
      else throw new Error("User can't accept Match");

      if(match.userA_confirmation && match.userB_confirmation) match.status = "ACCEPTED";

      return await match.save();
    },

    rejectMatch: async(userId: ObjectId, matchId: ObjectId) => {
      let match:IMatch = await Match.findById(matchId).exec();
      if(!match) throw new Error("Match doesn't exist");
      if(userId.toString() != match.userA_id.toString() && userId.toString() != match.userB_id.toString()){
        throw new Error("User can't reject Match");
      }
      let result: IMatch = await Match.findByIdAndDelete(matchId).exec();
      if(!result) throw new Error("Match couldn't be deleted");

      return result;
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
