import { Request, Response } from 'express';
import { RequestWithUser } from '../requestWithUser';
import userService from '../user/user.service';
import favorService from './favor.service';

const favor = {
  getFavors: async (req: RequestWithUser, res: Response) => {
    const userId = req.user._id;
    let user, favors;
    try {
      user = await userService.getUserInfo(userId);
      favors = await favorService.getAll();
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
};

export default favor;
