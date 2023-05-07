// import { Request, Response } from 'express';
// import User, { IUser } from '../user/user.model';
// import { RequestWithUser } from '../../requestWithUser';

// interface IFavorFilters {
//   favor_type: string;
//   favor_date: Date;
//   max_distance_km: number;
//   min_price_usd: number;
// }

// interface IFavorFiltersRequestBody {
//   favor_type: string;
//   date: Date;
//   max_distance_km: number;
//   min_price_usd: number;
// }

// const favorFilters = {
//   changeFavorFilters: async function (req: Request<{}, {}, IFavorFiltersRequestBody>, res: Response) {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).send({ message: 'Unauthorized' });
//     }

//     const user: IUser | null = await User.findById(userId).exec();
//     if (!user) {
//       return res.status(404).send({ message: "Couldn't find user" });
//     }

//     // user.preferences.favor_filters.favor_type = req.body.favor_type;
//     // user.preferences.favor_filters.favor_date = req.body.date;
//     user.preferences.favor_filters.max_distance_km = req.body.max_distance_km;
//     user.preferences.favor_filters.min_price_usd = req.body.min_price_usd;

//     try {
//       const updatedUser: IUser | null = await user.save();
//       if (!updatedUser) {
//         return res.status(500).send({
//           message: 'Unable to update user',
//         });
//       }
//       return res.send('Updated successfully');
//     } catch (error) {
//       console.log('ERROR: ', error.message);
//       return res.status(500).send({ message: 'Internal server error', error });
//     }
//   },

//   getFavorFilters: async function (req: RequestWithUser, res: Response<{ favor_filters: IFavorFilters }>) {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).send({ message: 'Unauthorized' });
//     }

//     const user: IUser | null = await User.findById(userId).exec();
//     if (!user) {
//       return res.status(404).send({ message: 'User not found' });
//     }

//     const favor_filters: IFavorFilters = {
//       favor_type: user.preferences.favor_filters.favor_type,
//       favor_date: user.preferences.favor_filters.favor_date,
//       max_distance_km: user.preferences.favor_filters.max_distance_km,
//       min_price_usd: user.preferences.favor_filters.min_price_usd,
//     };

//     res.json({ favor_filters });
//   },
// };

// export default favorFilters;
