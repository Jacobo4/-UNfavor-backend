import { Request, Response } from 'express';
import User, { IUser } from '../user/user.model';
import {RequestWithUser} from "../typescriptCrap/requestWithUser";

interface IFavorFilters {
  favor_type: string;
  max_distance_km: number;
}

const favorFilters = {
  changeFavorFilters: async function (req: RequestWithUser, res: Response) {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const user: IUser | null = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).send({ message: "Couldn't find user" });
    }

    user.preferences.favor_filters.favor_type = req.body.favor_type;
    user.preferences.favor_filters.max_distance_km = req.body.max_distance_km;

    try {
      const updatedUser: IUser | null = await user.save();
      if (!updatedUser) {
        return res.status(500).send({
          message: 'Unable to update user',
        });
      }
      return res.status(200).send({
        message: 'Updated successfully',
        preferences: updatedUser.preferences
      });
    } catch (error) {
      console.log('ERROR: ', error.message);
      return res.status(500).send({ message: 'Internal server error', error });
    }
  },

  getFavorFilters: async function (req: RequestWithUser, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const user: IUser | null = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const favor_filters: IFavorFilters = {
      favor_type: user.preferences.favor_filters.favor_type,
      max_distance_km: user.preferences.favor_filters.max_distance_km,
    };

    res.status(200).send({ favor_filters });
  },
};

export default favorFilters;
