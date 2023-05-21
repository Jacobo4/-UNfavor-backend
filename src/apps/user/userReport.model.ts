import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUserReport extends Document {
  favorId: ObjectId;
  description: string;
}

const UserReportSchema = new Schema<IUserReport>({
  favorId: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
}, { collection: 'userReports' });

export default mongoose.model<IUserReport>('UserReport', UserReportSchema);
