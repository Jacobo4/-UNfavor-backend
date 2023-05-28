import mongoose, { Schema } from 'mongoose';

const Subscription = new Schema ({
  userId: Schema.Types.ObjectId,
  endpoint: String,
  expirationTime: Number,
  keys: {
    p256dh: String,
    auth: String,
  },
});

export default mongoose.model ('subscription', Subscription)