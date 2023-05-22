import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import {IFavor} from '../user/user.model';

export interface IFavorExtended extends IFavor {
  user_id: ObjectId,
}

export interface IFavorHistory extends Document {
  _id: ObjectId;
  favors: IFavorExtended[];
}

const FavorHistorySchema = new Schema<IFavorHistory>({
  _id: Schema.Types.ObjectId,
  favors: [{
    user_id: Schema.Types.ObjectId,
    date_published: { type: Date, default: Date.now },
    favor_state: { type: String, enum: ['REVIEWING', 'PUBLISHED', 'DENIED'], default: 'REVIEWING' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: String,
    location: String,
    possible_matches: [Schema.Types.ObjectId],
    reviews: {
      review_sum: Number,
      review_num: Number,
      comments: [String],
    }
  }],
}, { collection: 'matchs' });

export interface IFavorRecommendation {
  user_id: ObjectId;
  name: string;
  age: number;
  favor_date_published: Date;
  favor_title: string;
  favor_description: string;
  favor_category: string;
  favor_review_avg: number;
}

export default mongoose.model<IFavorHistory>('FavorHistory', FavorHistorySchema);
