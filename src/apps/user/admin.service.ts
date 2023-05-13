import bcrypt from 'bcrypt';
import jwtService from '../authenticate/jwt.service';
import User, { IUser } from './user.model';
import Favor, { IFavor } from '../favor/favor.model';
import { _ } from "lodash";
import axios from 'axios';

interface IUserInfo {
  email: string;
  password: string;
  [key: string]: any;
}

interface IChatUser {
  username: string;
  secret: string;
  first_name: string;
}

interface ITokens {
    access: string;
    refresh: string;
}

const adminService = {
  /*
  login: async function (info: IUserInfo): Promise<{ user: IUser; tokens: ITokens}> {
    const { email, password } = info;
    var user: IUser = await User.findOne({ email });
    if (!user) throw new Error(`Invalid credentials`);

    var validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) throw new Error(`Invalid credentials`);

    let chat = await this.loginChat(user);
    if (!chat) throw new Error("Error login chat");

    var tokens: ITokens = jwtService.generate(user._id, user.email, user.admin, chat.secret);
    return { user, tokens };
  },
  */

    getAdminInfo: async function (userId: string): Promise<IUser> {
        let user: IUser = await User.findOne({ _id: userId }).select('-password').exec();
        if (!user) throw new Error(`User not found`);
        return user;
    },

    allUsers: async function (): Promise<IUser[]> {
        let users: IUser[] = await User.find().select('-password').exec();
        if (!users) throw new Error(`Users not found`);
        return users;
    },

    test: async function (): Promise<any> {
        let data = await User.aggregate([
            {
                $group: {
                    _id: "$name",
                    count: { $sum: 1 }
                }
            }
        ]).exec();
        return data;
    },

    modifyFavor: async function (favorId: string, newStatus: string): Promise<IFavor> {
        if (!['REVIEWING', 'PUBLISHED', 'DENIED'].includes(newStatus)) throw new Error(`Status not accepted`);
        let favor: IFavor = await Favor.findOneAndUpdate({ _id: favorId }, { favor_state: newStatus }, { new: true }).exec();
        if (!favor) throw new Error(`Favor not found`);
        return favor;
    }

}

export default adminService;

