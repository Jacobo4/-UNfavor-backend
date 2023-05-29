import mongoose from "mongoose";
import webpush from 'web-push';
import {config} from "./config/config";
import app from "./app";
import Match from "./apps/match/match.model";
import Subscription from './apps/user/suscribe.model';
import UserService from "./apps/user/user.service";

mongoose.connect(config.mongo.url, {  retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(config.server.port, ()=>{
            console.log("Todo melo con el servidor, esta en el puerto: "+config.server.port);
        });

    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });

// Initialize web-push with your VAPID keys
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NOTIFICATION_PUBLIC_KEY,
  process.env.NOTIFICATION_PRIVATE_KEY
);

// Handle change events
Match.watch().on('change', async (change) => {
  console.log("ENTRANDOOOOOO", change.operationType);
  if (change.operationType === 'insert') {
    const newMatch = change.fullDocument;
    for(let id of [newMatch.userA_id, newMatch.userB_id]) {

      // Retrieve user's subscription information from MongoDB
      let subscription = await Subscription.find({userId: id}).select('-userId').exec();
      if (!subscription) {
        console.error('Error retrieving user:');
        return;
      }

      let user;
      if(id.toString() == newMatch.userA_id.toString()) user = await UserService.getUserInfo(newMatch.userB_id);
      else user = await UserService.getUserInfo(newMatch.userA_id);

      // Prepare the push notification payload
      const payload = JSON.stringify({
        title: 'New Match',
        body: 'You have a new match with '+user.email+'!',
      });

      // Send the push notification using web-push
      webpush.sendNotification(subscription[0], payload)
        .then(() => {
          console.log('Successfully sent push notification with id:', id);
        })
        .catch((error) => {
          console.error('Error sending push notification:', error);
        });
    }
  }
});