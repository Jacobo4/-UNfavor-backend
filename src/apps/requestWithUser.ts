import { Request } from 'express';
import { IUser } from './user/user.model';

export interface RequestWithUser extends Request {
  user: IUser;
}
