import { Request, Response } from 'express';
import userService from './user.service';
import { RequestWithUser } from '../../requestWithUser';

const userController = {
  getUser: async function (req: RequestWithUser, res: Response) {
    try {
      const user = await userService.getUserInfo(req.user._id);
      res.status(200).send({
        message: 'User found',
        user: user,
      });
    } catch (error) {
      console.log('ERROR: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  signup: async function (req: Request, res: Response) {
    try {
      const favor = await userService.createFavor(req.body.favor);
      req.body.user.favor = favor;
      const { result, tokens } = await userService.signup(req.body.user);
      res.status(200).send({
        message: 'Saved user',
        userInfo: result,
        favorInfo: favor,
        access: tokens.access,
        refresh: tokens.refresh,
      });
    } catch (error) {
      console.log('ERROR: ', error.message);
      res.status(500).send({ message: error.message, error });
    }
  },

  login: async function (req: Request, res: Response) {
    try {
      const { user, tokens, chat } = await userService.login(req.body);
      if (!user) return res.status(401).send({ message: 'Invalid credentials' });
      if (!tokens) return res.status(500).send({ message: 'Error generating tokens' });

      res.status(200).send({
        message: 'Logged in',
        access: tokens.access,
        refresh: tokens.refresh,
        chat: chat,
      });
    } catch (error) {
      console.log('ERROR: ', error.message);
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
      console.log('ERROR: ', error.message);
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
      console.log('ERROR: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  admin: async function (req: RequestWithUser, res: Response) {
    res.status(200).send({
      message: "I'm authenticated. This is a protected route",
      user: req.user,
    });
  },

  post: async function (req: Request, res: Response) {
    try {
      const favor = await userService.createFavor(req.body);
      res.status(200).send({
        message: 'Favor created',
        favor: favor,
      });
    } catch (error) {
      console.log('ERROR: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  updateUser: async function (req: RequestWithUser, res: Response) {
    try {
      const user = await userService.updateUserProfileInfo(req.user._id, req.body.newUserData);
      res.status(200).send({
        message: 'User Updated',
        user: user,
      });
    } catch (error) {
      console.log('ERROR: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },

  deleteUser: async function (req: RequestWithUser, res: Response) {
    try {
      const user = await userService.deleteUser(req.user._id);
      res.status(200).send({
        message: 'User Deleted',
        user: user,
      });
    } catch (error) {
      console.log('ERROR: ', error.message);
      return res.status(401).send({ message: error.message, error });
    }
  },
};

export default userController;
