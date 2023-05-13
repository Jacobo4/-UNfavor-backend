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
  date_published: { type: Date, default: Date.now },
  date_accepted: Date,
  date_completed: Date,
  favor_state: { type: String, enum: ['REVIEWING', 'PUBLISHED', 'DENIED'], default: 'REVIEWING' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  location: String,
  chat_id: Schema.Types.ObjectId,
  reviews: {
    score: Number,
    description: String
  },
}, { collection: 'favors' });

export default mongoose.model<IFavor>('Favors', FavorSchema);
