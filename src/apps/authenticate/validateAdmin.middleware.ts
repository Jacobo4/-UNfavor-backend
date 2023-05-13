import jwtService from "./jwt.service";
import validateToken from "./validateToken.middleware";

const verifyAdmin = function (req, res, next){
    try{
        let accessToken = req.headers.authorization.split("Bearer")[1].trim();
        if (!accessToken) return res.status(401).send({ message: `Access token is required` });

        let verified = jwtService.isAdmin(accessToken);
        if(!verified){
            console.log("No es admin");
            return res.status(500).send({ message: "Unanthorized" });
        }
        req.user = { id: verified.id, email: verified.email };
        next();
    }catch (error) {
        console.log("ERROR in verifyAdmin: ", error.message);
        res.status(500).send({ message: error.message, error });
    }
}

export default verifyAdmin;