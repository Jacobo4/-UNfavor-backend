import { Request, Response } from 'express';
import userService from './user.service';
import { RequestWithUser } from '../typescriptCrap/requestWithUser';
import { IUser, IFavor } from './user.model';
import { ITokens } from '../typescriptCrap/userTypes';

const userController = {
  getUser: async function (req: RequestWithUser, res: Response) {
    try {
      const user: IUser = await userService.getUserInfo(req.user.id);
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
      const profile: IUser = await userService.getProfile(req.body.query);
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
      const aux: any = await userService.signup(req.body.user, req.body.favor);
      let result: IUser = aux.result;
      let tokens: ITokens = aux.tokens;
      let favor: IFavor = aux.favor;

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
      const aux: any = await userService.login(req.body);
      let user: IUser = aux.user;
      let tokens: ITokens = aux.tokens;
      let favor: IFavor = aux.favor;

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

  logout: async function (_: Request, res: Response) {
    try {
      const tokens: ITokens = await userService.logout();
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
      const accessToken: string = await userService.refresh(req);
      res.header({ accesstoken: accessToken }).status(200).send({
        message: 'Access token refreshed',
        access: accessToken,
      });
    } catch (error) {
      console.log('ERROR in refresh: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  updateUser: async function (req: RequestWithUser, res: Response) {
    try {
      const user: IUser = await userService.updateUserProfileInfo(req.user.id, req.body.newUserData);
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
      const user: IUser = await userService.deleteUser(req.user.id);
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
