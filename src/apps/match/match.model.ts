import mongoose, { Schema, Document, ObjectId } from 'mongoose';
export interface IMatch extends Document {
  userA_id: ObjectId;
  userB_id: ObjectId;
  userA_confirmation?: boolean;
  userB_confirmation?: boolean;
  date_accepted?: Date;
  date_completed?: Date;
  status?: string;
  chat_id?: ObjectId;
}

const MatchSchema = new Schema<IMatch>({
  userA_id: Schema.Types.ObjectId,
  userB_id: Schema.Types.ObjectId,
  userA_confirmation: { type: Boolean, default: false},
  userB_confirmation: { type: Boolean, default: false},
  date_accepted: { type: Date, default: Date.now},
  date_completed: Date,
  status: { type: String, default: 'CREATED' },
  chat_id: String,
}, { collection: 'matchs' });

export default mongoose.model<IMatch>('Matchs', MatchSchema);
