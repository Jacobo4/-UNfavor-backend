import { verify } from "crypto";
import jwtService from "../services/jwt.service";

const verifyToken = function (req, res, next) {
    try{
        var accessToken = req.headers.accesstoken;
        if(!accessToken) return res.status(401).send({ message:`Access token is required` });

        var verified = jwtService.verify(accessToken);
        if(!verified) return res.status(500).send({ message:`Failed to authenticate token` });

        req.token = verified;
        next();
    }catch (error) {
        console.log("ERROR: ", error.message);
        res.status(500).send({ message: error.message, error });
    }
};

export default verifyToken;