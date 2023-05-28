import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUserReport extends Document {
  reporterId: ObjectId;
  reportedId: ObjectId;
  description: string;
  status?: string;
}

const UserReportSchema = new Schema<IUserReport>({
  reporterId: { type: Schema.Types.ObjectId, required: true },
  reportedId: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "REVIEWING"}
}, { collection: 'userReports' });

export default mongoose.model<IUserReport>('UserReport', UserReportSchema);
