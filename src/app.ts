import express from 'express';

//import routes
import route_user from './apps/user/user.routes';
import route_favor from './apps/favor/favor.routes';

const app = express();


//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//routes
app.use("/user", route_user);
app.use("/favor", route_favor);

export default app;
