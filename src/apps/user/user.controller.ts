import { Request, Response } from 'express';
import userService from './user.service';
import { RequestWithUser } from '../typescriptCrap/requestWithUser';

const userController = {
  getUser: async function (req: RequestWithUser, res: Response) {
    try {
      const user = await userService.getUserInfo(req.user.id);
      res.status(200).send({
        message: 'User found',
        user: user,
      });
    } catch (error) {
      console.log('ERROR in getUser: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  seeProfile: async function (req: Request, res: Response) {
    try {
      if(!req.body.query) throw new Error('No query provided');
      const profile = await userService.getProfile(req.body.query);
      res.status(200).send({
          message: 'Profile found',
          profile: profile,
      });
    } catch (error) {
      console.log('ERROR in seeProfile: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  signup: async function (req: Request, res: Response) {
    try {
      const { result, tokens, favor } = await userService.signup(req.body.user, req.body.favor);
      res.status(200).send({
        message: 'Saved user',
        userInfo: result,
        favorInfo: favor,
        access: tokens.access,
        refresh: tokens.refresh,
      });
    } catch (error) {
      console.log('ERROR in signup: ', error.message);
      res.status(500).send({ message: error.message, error });
    }
  },

  login: async function (req: Request, res: Response) {
    try {
      const { user, tokens, favor } = await userService.login(req.body);
      if (!user) return res.status(401).send({ message: 'Invalid credentials' });
      if (!tokens) return res.status(500).send({ message: 'Error generating tokens' });
      if(favor == undefined) return res.status(500).send({ message: 'Error getting favor' });

      res.status(200).send({
        message: 'Logged in',
        access: tokens.access,
        refresh: tokens.refresh,
        favor,
      });
    } catch (error) {
      console.log('ERRORin login: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  logout: async function (req: Request, res: Response) {
    try {
      const tokens = await userService.logout();
      res.status(200).send({
        message: 'Logged out',
        access: tokens.access,
        refresh: tokens.refresh,
      });
    } catch (error) {
      console.log('ERROR in logout: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  refresh: async function (req: Request, res: Response) {
    try {
      const accessToken = await userService.refresh(req);
      res.header({ accesstoken: accessToken }).status(200).send({
        message: 'Access token refreshed',
        access: accessToken,
      });
    } catch (error) {
      console.log('ERROR in refresh: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  post: async function (req: RequestWithUser, res: Response) {
    try {
      req.body.user_published_id = req.user.id;
      const favor = await userService.createFavor(req.body);
      res.status(200).send({
        message: 'Favor created',
        favor: favor,
      });
    } catch (error) {
      console.log('ERROR in post: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  updateUser: async function (req: RequestWithUser, res: Response) {
    try {
      const user = await userService.updateUserProfileInfo(req.user.id, req.body.newUserData);
      res.status(200).send({
        message: 'User Updated',
        user: user,
      });
    } catch (error) {
      console.log('ERROR in updateUser: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  deleteUser: async function (req: RequestWithUser, res: Response) {
    try {
      const user = await userService.deleteUser(req.user.id);
      res.status(200).send({
        message: 'User Deleted',
        user: user,
      });
    } catch (error) {
      console.log('ERROR in deleteUser: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },
};

export default userController;
