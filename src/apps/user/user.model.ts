import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
  user_reviews_num: number;
  user_reviews_avg: number;
  user_favors: ObjectId[];
  favor: {
    user_published_id: ObjectId;
    date_published?: Date;
    title?: string;
    description?: string;
    category?: string;
    location?: string;
    chat_id?: ObjectId;
    rank: number;
  };
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
  user_reviews_num: { type: Number, default: 0 },
  user_reviews_avg: { type: Number, default: 0 },
  user_favors: [Schema.Types.ObjectId],
  favor: {
    user_published_id: Schema.Types.ObjectId,
    date_published: Date,
    title: String,
    description: String,
    category: String,
    location: String,
    chat_id: Schema.Types.ObjectId,
    rank: { type: Number, default: 0 },
  },
  preferences: {
    favor_filters: {
      favor_type: { type: String, default: 'Any' },
      max_distance_km: { type: Number, default: 50 },
    },
  },
}, { collection: 'users' });

export default mongoose.model<IUser>('Users', UserSchema);
