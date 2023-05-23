import User from '../user/user.model';
import {IUser, IFavor} from '../user/user.model';
import {ObjectId} from "mongoose";
import matchService from "../match/match.service";
import {IMatch} from "../match/match.model";

interface IProfile extends IFavor{
  id: ObjectId,
  email: String
}

const favorService = {

  getFavorInfo: async function (userId: ObjectId): Promise<IUser> {
    let allowedFinished = ['favor.reviews', 'favor.title', 'favor.description', 'favor.location', 'name', 'email'];
    let user: IUser = await User.findById(userId).select(allowedFinished).exec();

    if (!user) throw new Error(`User not found`);
    return user;
  },

  getAll: async (userId: ObjectId): Promise<IFavor[]> => {
    const users: IUser[] = await User.find({"favor.favor_state": "PUBLISHED"}).exec();
    if (!users) throw new Error(`Error getting favors`);
    let favors: IProfile[] = []
    let favor: Partial<IProfile>;
    for(let i = 0; i < users.length; i++){
      if(users[i]._id.toString() == userId.toString()) continue;
      favor = {...users[i].favor};
      favor.id = users[i]._id;
      favor.email = users[i].email;
      favors.push(<IProfile>favor);
    }
    return favors;
  },

  userLikeFavor: async (userAId: ObjectId, userBId: ObjectId): Promise<IFavor> => {
    if(!userAId) throw new Error(`Error getting userAId`);
    if(!userBId) throw new Error(`Error getting userBId`);
    if(userAId == userBId) throw new Error('Can\'t like your own favor');

    let userB: IUser = await User.findById(userBId).exec();

    if (!userB) throw new Error(`Error getting userB`);
    if(!userB.favor.possible_matches.includes(userAId)){
      userB.favor.possible_matches.push(userAId);
      const result: IUser = await userB.save();

      if (!result) throw new Error(`Error saving favor`);

      userB = result;
    }

    let match = await favorService.lookForMatch(userAId, userBId);

    if(!match){
      if(match==null) console.log("Match is null");
      else throw new Error(`Error getting match`);
    }

    return userB.favor;
  },

  lookForMatch: async (userAId: ObjectId, userBId: ObjectId): null | Promise<IMatch> => {
    if(!userAId) throw new Error(`Error getting userAId`);
    if(!userBId) throw new Error(`Error getting userBId`);

    let userA: IUser = await User.findById(userAId).exec();
    let userB: IUser = await User.findById(userBId).exec();

    if (!userA) throw new Error(`Error getting userA`);
    if (!userB) throw new Error(`Error getting userB`);

    if(!userA.favor.possible_matches.includes(userB._id)) {
      console.log(`User doesn't match :(`);
      return null;
    }

    return await matchService.createMatch(userA, userB);
  }

};

export default favorService;
