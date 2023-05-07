import { Request } from 'express';
import { IUser } from './apps/user/user.model';

export interface RequestWithUser extends Request {
  user: IUser;
}
