import { Response } from 'express';
import { ObjectId } from 'mongoose';
import { RequestWithUser } from '../typescriptCrap/requestWithUser';
import { IFavor, IUser } from '../user/user.model';
import userService from '../user/user.service';
import favorService from './favor.service';

const favor = {
  getFavors: async (req: RequestWithUser, res: Response) => {
    const userId = req.user.id;
    let user: IUser, favors: IFavor[];
    try {
      user = await userService.getUserInfo(userId);
      favors = await favorService.getAll(userId);
    } catch (error) {
      console.log('ERROR in getFavors: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
    let filters = user.preferences.favor_filters;
    if (!filters)
      return res.status(404).send({ message: 'User preferences error' });

    res.status(200).send({
      message: 'Favors found',
      favors: favors,
    });
  },

  likeFavor: async (req: RequestWithUser, res: Response) => {
    const userAId: ObjectId = req.user.id;
    const userBId: ObjectId = req.body.userId;
    let favor: IFavor;
    try {
      favor = await favorService.userLikeFavor(userAId, userBId);
    } catch (error) {
      console.log('ERROR in likeFavor: ', error.message);
      return res.status(401).send({ name: error.name, message: error.message });
    }

    res.status(200).send({
      message: 'Favor liked',
      favor: favor,
    });
  },

  recommendFavors: async (req: RequestWithUser, res: Response) => {
    const userId: ObjectId = req.user.id;
    const latitude: Number = req.body.latitude;
    const longitude: Number = req.body.longitude;

    let recommended_favors: Array<Partial<IUser>> = [];
    try{
      recommended_favors = await favorService.recommendFavors(userId, latitude, longitude);
    }catch (error){
      console.log('ERROR in recommend favors: ', error.message);
      return res.status(401).send({name: error.name, message: error.message});
    }

    res.status(200).send({
      message: 'Favor recommended',
      favors: recommended_favors
    });
  }

};

export default favor;
