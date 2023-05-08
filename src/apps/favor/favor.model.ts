import mongoose, { Schema, Document, ObjectId } from 'mongoose';
export interface IFavor extends Document {
  user_published_id: ObjectId;
  user_accepted_id?: ObjectId;
  date_published?: Date;
  date_accepted?: Date;
  date_completed?: Date;
  favor_state?: string;
  title?: string;
  description?: string;
  category?: string;
  price?: mongoose.Types.Decimal128;
  location?: string;
  chat_id?: ObjectId;
  reviews?: {
    score?: number;
    description?: string;
  };
}

const FavorSchema = new Schema<IFavor>({
  user_published_id: Schema.Types.ObjectId,
  user_accepted_id: Schema.Types.ObjectId,
  date_published: Date,
  date_accepted: Date,
  date_completed: Date,
  favor_state: String,
  title: String,
  description: String,
  category: String,
  price: Schema.Types.Decimal128,
  location: String,
  chat_id: Schema.Types.ObjectId,
  reviews: {
    score: Number,
    description: String
  },
}, { collection: 'favors' });

export default mongoose.model<IFavor>('Favors', FavorSchema);
