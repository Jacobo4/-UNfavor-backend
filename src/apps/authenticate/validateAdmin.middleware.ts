import jwtService from "./jwt.service";
import validateToken from "./validateToken.middleware";

const verifyAdmin = function (req, res, next){
    try{
        validateToken(req, res, next);
        if(!req.user) return res.status(401).send({ message: `Unauthorized` });

        let accessToken = req.headers.authorization.split("Bearer")[1].trim();
        let verified = jwtService.isAdmin(accessToken);
        if(!verified) console.log("No es admin");
        else console.log("Es admin");
    }catch (error) {
        console.log("ERROR: ", error.message);
        res.status(500).send({ message: error.message, error });
    }
}

export default verifyAdmin;