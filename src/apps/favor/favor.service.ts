import User from '../user/user.model';
import {IUser, IFavor} from '../user/user.model';
import {ObjectId} from "mongoose";
import matchService from "../match/match.service";
import {IMatch} from "../match/match.model";
import FavorHistory, { IFavorHistory, IFavorRecommendation } from './favor.model';
import {IFavorExtended} from './favor.model';
import vectorDBService from '../vectorDB/vector.service';


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

  recommendFavors: async (userId: ObjectId, latitude: Number, longitude: Number): Promise<Array<IFavorRecommendation>> => {
    const favor_history: IFavorHistory = await FavorHistory.findById(userId).exec();
    if(!favor_history) throw new Error('Error getting user favor history');

    const user: IUser = await User.findById(userId).exec();
    if(!user) throw new Error('Error getting user')

    const recommendations: Array<any> = await vectorDBService.getRecommendation(favor_history, user, latitude, longitude);

    if(!recommendations){
      return [];
    }

    let matched_userids: Array<ObjectId> = []

    for(let i: number = 0; i < recommendations.length; i++){
      matched_userids.push(recommendations[i].userid);
    }

    let recommended_favors: Array<IFavorRecommendation> = [];
    
    const recommended_users: Array<IUser> = await User.find({
      '_id': {
        $in: matched_userids
      }
    }).exec();
    if(!recommended_users) throw new Error("Error recomendations couldn't be found");

    for(let i: number = 0; i < recommended_users.length; i++){
      recommended_favors.push({
        user_id: recommended_users[i]._id,
        name: recommended_users[i].name,
        age: recommended_users[i].age,
        favor_date_published: recommended_users[i].favor.date_published,
        favor_title: recommended_users[i].favor.title,
        favor_description: recommended_users[i].favor.description,
        favor_category: recommended_users[i].favor.category,
        favor_review_avg: recommended_users[i].favor.reviews.review_sum / recommended_users[i].favor.reviews.review_num,
        favor_img_url: recommended_users[i].favor.imgURL 
      });
    }

    return recommended_favors;
  },

  userLikeFavor: async (userAId: ObjectId, userBId: ObjectId): Promise<IFavor> => {
    if(!userAId) throw new Error(`Error getting userAId`);
    if(!userBId) throw new Error(`Error getting userBId`);
    if(userAId == userBId) throw new Error('Can\'t like your own favor');

    let userA: IUser = await User.findById(userAId).exec();
    let userB: IUser = await User.findById(userBId).exec();

    if(!userA) throw new Error('Error getting userA');
    if (!userB) throw new Error(`Error getting userB`);

    const likedFavor: IFavorExtended = {
      ...userB.favor,
      user_id: userB._id
    };
    await FavorHistory.updateOne({_id: userA._id}, {$addToSet: {favors: likedFavor}}).exec();

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

  userDislikeFavor: async (userAId: ObjectId, userBId: ObjectId): Promise<null> => {
    if(!userAId) throw new Error(`Error getting userAId`);
    if(!userBId) throw new Error(`Error getting userBId`);
    if(userAId == userBId) throw new Error('Can\'t dislike your own favor');

    let userA: IUser = await User.findById(userAId).exec();
    let userB: IUser = await User.findById(userBId).exec();

    if(!userA) throw new Error('Error getting userA');
    if (!userB) throw new Error(`Error getting userB`);

    const likedFavor: IFavorExtended = {
      ...userB.favor,
      user_id: userB._id
    };
    await FavorHistory.updateOne({_id: userA._id}, {$addToSet: {favors: likedFavor}}).exec();

    return ;
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
