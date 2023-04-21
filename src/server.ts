import mongoose from "mongoose";
import {config} from "./config/config";
import app from "./app";

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

