import Favor from './favor.model';
import { IFavor } from './favor.model';
import {ObjectId} from "mongoose";
import matchService from "../match/match.service";
import {IMatch} from "../match/match.model";

const favorService = {

  getFavor: async (userId: ObjectId): null | Promise<IFavor> => {
    const favor: IFavor = await Favor.findOne({ user_published_id: userId }).exec();
    if (!favor) return null;
    return favor;
  },

  getAll: async (): Promise<IFavor[]> => {
    const favors = await Favor.find().exec();
    if (!favors) throw new Error(`Error getting favors`);
    return favors;
  },

  userLikeFavor: async (userAId: ObjectId, favorBId: ObjectId): Promise<IFavor> => {
    if(!userAId) throw new Error(`Error getting userAId`);
    if(!favorBId) throw new Error(`Error getting favorBId`);
    const favorB: IFavor = await Favor.findById(favorBId).exec();
    if (!favorB) throw new Error(`Error getting favorB`);
    if (favorB.user_published_id == userAId) throw new Error(`User can't like his own favor`);
    if(!favorB.possible_matches.includes(userAId)) favorB.possible_matches.push(userAId);
    const result = await favorB.save();
    if (!result) throw new Error(`Error saving favor`);

    let match = await favorService.lookForMatch(userAId, favorB);
    if(!match){
      if(match==null) console.log("Match is null");
      else throw new Error(`Error getting match`);
    }

    return result;
  },

  lookForMatch: async (userAId: ObjectId, favorB: IFavor): null | Promise<IMatch> => {
    if(!userAId) throw new Error(`Error getting userAId`);
    if(!favorB) throw new Error(`Error getting userBId`);
    let favorA: IFavor = await favorService.getFavor(userAId);
    if (!favorA) throw new Error(`Error getting favorA`);

    if(!favorA.possible_matches.includes(favorB.user_published_id)) {
      console.log(`User doesn't match :(`);
      return null;
    }

    return await matchService.createMatch(favorA, favorB);
  }

};

export default favorService;
