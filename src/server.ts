import express from "express";
import mongoose from "mongoose";
import {config} from "./config/config";

const app = require('./app');

// DB Setup - Connec to Mongoose
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
/*
const StartServer = () => {
    router.use((req, res, next) => {
        res.on('finish', () => {
            console.log(`${req.method} ${req.url} - ${res.statusCode}`);
        });

        next();

    });

    router.use(express.urlencoded({extended: true}));
    router.use(express.json());

    //Rules of our API

    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        if(req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            return res.status(200).json({});
        }

        next();
    });

    //Routes which should handle requests

    //Testing
    router.get('/ping', (req, res) => {
        res.status(200).json({
            message: 'Pong'
        });
    });

    //Error handling
    router.use((req, res, next) => {
        const error = new Error('Not found');
        return res.status(404).json({
            message: error.message
        });
    });

    http.createServer(router).listen(config.server.port, () => {
        console.log(`Server is listening on ${config.server.port}`);
    });

};
*/