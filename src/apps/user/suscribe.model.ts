const mongoose = require ('mongoose');

const Subscription = new mongoose.Schema ({
  endpoint: String,
  expirationTime: Number,
  keys: {
    p256dh: String,
    auth: String,
  },
});

export default mongoose.model ('subscription', Subscription)