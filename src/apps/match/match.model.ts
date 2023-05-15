import mongoose, { Schema, Document, ObjectId } from 'mongoose';
export interface IMatch extends Document {
  userA_id: ObjectId;
  userB_id: ObjectId;
  date_accepted?: Date;
  date_completed?: Date;
  status?: string;
  chat_id?: ObjectId;
}

const MatchSchema = new Schema<IMatch>({
  userA_id: Schema.Types.ObjectId,
  userB_id: Schema.Types.ObjectId,
  date_accepted: { type: Date, default: Date.now},
  date_completed: Date,
  status: { type: String, default: 'ALGO' },
  chat_id: String,
}, { collection: 'matchs' });

export default mongoose.model<IMatch>('Matchs', MatchSchema);
