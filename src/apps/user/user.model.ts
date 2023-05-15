import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IFavor {
  date_published?: Date;
  favor_state?: string;
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  possible_matches?: ObjectId[];
  reviews?: {
    review_sum?: number;
    review_num?: number;
    comments?: string[];
  };
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
  admin: boolean;
  favor: IFavor;
  preferences: {
    favor_filters: {
      favor_type: string;
      max_distance_km: number;
    };
  };
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  age: Number,
  admin: {type: Boolean, default: false},
  favor: {
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
      comments: [String]
    },
  },
  preferences: {
    favor_filters: {
      favor_type: { type: String, default: 'Any' },
      max_distance_km: { type: Number, default: 50 },
    },
  },
}, { collection: 'users' });

export default mongoose.model<IUser>('Users', UserSchema);
