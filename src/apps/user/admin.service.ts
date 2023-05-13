import bcrypt from 'bcrypt';
import jwtService from '../authenticate/jwt.service';
import User, { IUser } from './user.model';
import Favor, { IFavor } from '../favor/favor.model';
import { _ } from "lodash";
import axios from 'axios';
import mongoose from "mongoose";

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
    },

    //Create a function that returns the number of users that have published a favor
    data: async function (): Promise<any> {
        let totalUsers = await User.count().exec();
        let totalFavors = await Favor.count().exec();
        let totalPublishedFavors = await Favor.count({ favor_state: 'PUBLISHED' }).exec();
        let totalReviewingFavors = await Favor.count({ favor_state: 'REVIEWING' }).exec();
        let totalDeniedFavors = await Favor.count({ favor_state: 'DENIED' }).exec();

        let userScore = await User.aggregate([
          {
            $bucket: {
              groupBy: "$user_reviews_avg",
              boundaries: [ 0.5, 1.5, 2.5, 3.5, 4.5, 5.5 ],
              default: 0,
              output: {
                "count": { $sum: 1 },
              }
            }
          }
        ]).exec();

        let favorsPerMonth = await Favor.aggregate([
            {
                $group: {
                    _id: {year: {$year: "$date_published"}, month: {$month: "$date_published"}},
                    count: { $sum: 1 }
                }
            }
        ]).exec();

        let data = {
            totalUsers,
            totalFavors,
            totalPublishedFavors,
            totalReviewingFavors,
            totalDeniedFavors,
            favorsPerMonth,
            userScore
        }

        return data;
    }

}

export default adminService;

