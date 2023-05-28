import User, { IUser, IFavor } from '../user/user.model';
import { ObjectId } from "mongoose";
import UserReport, { IUserReport } from '../user/userReport.model';
import userService from "../user/user.service";

const adminService = {

    allUsers: async function (): Promise<IUser[]> {
        let users: IUser[] = await User.find().select('-password').exec();
        if (!users) throw new Error(`Users not found`);
        return users;
    },

    modifyFavor: async function (userId: ObjectId, newStatus: string): Promise<IFavor> {
        if (!['REVIEWING', 'PUBLISHED', 'DENIED'].includes(newStatus)) throw new Error(`Status not accepted`);

        const user: IUser = await User.findByIdAndUpdate(userId, { "$set": {"favor.favor_state": newStatus} }, { new: true }).exec();
        if (!user) throw new Error(`User favor not found`);

        return user.favor;
    },

    //Create a function that returns the number of users that have published a favor
    data: async function (): Promise<any> {
        let totalUsers = await User.count().exec();
        let totalPublishedFavors = await User.count({ "favor.favor_state": 'PUBLISHED' }).exec();
        let totalReviewingFavors = await User.count({ "favor.favor_state": 'REVIEWING' }).exec();
        let totalDeniedFavors = await User.count({ "favor.favor_state": 'DENIED' }).exec();

        let userScore: any = await User.aggregate([
          {
            $bucket: {
              groupBy: {"$divide": ["$favor.reviews.review_sum", "$favor.reviews.review_num"]},
              boundaries: [ 0.5, 1.5, 2.5, 3.5, 4.5, 5.5 ],
              default: 0,
              output: {
                "count": { $sum: 1 },
              }
            }
          }
        ]).exec();

        let favorsPerMonth: any = await User.aggregate([
            {
                $group: {
                    _id: {year: {$year: "$favor.date_published"}, month: {$month: "$favor.date_published"}},
                    count: { $sum: 1 }
                }
            }
        ]).exec();

        let data = {
            totalUsers,
            totalPublishedFavors,
            totalReviewingFavors,
            totalDeniedFavors,
            favorsPerMonth,
            userScore
        }

        return data;
    },

    getAllReports: async function (): Promise<IUserReport[]> {
        let reports: IUserReport[] = await UserReport.find().exec();
        if (!reports) throw new Error(`Reports not found`);
        return reports;
    },

    getReportedUsers: async function(){
      let reports: IUserReport[] = await this.getAllReports();
      let repUsers: IUser[] = [];
      for(let report of reports){
          let user = await userService.getUserInfo(report.reportedId);
          repUsers.push(user);
      }
      return repUsers;
    },

    controlReports: async function(reportId: ObjectId, action: string){
        if(!reportId) throw new Error("No report selected");
        if(action!='ACCEPT' && action!='REJECT') throw new Error("No valid action");

        let report: IUserReport = await UserReport.findById(reportId).exec();
        if(!report) throw new Error("Report doesn't exist");

        if(action=='ACCEPT') {
            let deleteUser = await User.findByIdAndDelete(report.reportedId).exec();
            if (!deleteUser) throw new Error("Error deleting user");
        }

        let deleteReport = await UserReport.findByIdAndDelete(reportId).exec();
        if(!deleteReport) throw new Error("Error deleting report");

        return action=='ACCEPT' ? `User ${report.reportedId} banned` : `Report ignored`;

    }

}

export default adminService;

