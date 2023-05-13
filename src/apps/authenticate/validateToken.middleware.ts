import { Request, Response, NextFunction } from 'express';
import jwtService from './jwt.service';

interface IRequestWithUser extends Request {
  user?: { id: string; email: string };
}

const verifyToken = function (req: IRequestWithUser, res: Response, next: NextFunction): Response | void {
  try {
    if (!req.headers.authorization) return res.status(401).send({ message: `Access token is required` });
    var accessToken = req.headers.authorization.split("Bearer")[1].trim();
    if (!accessToken) return res.status(401).send({ message: `Access token is required` });

    var verified = jwtService.verify(accessToken, process.env.JWT_ACCESS as string);
    if (!verified) return res.status(500).send({ message: `Failed to authenticate token` });

    req.user = { id: verified.id, email: verified.email };
    next();
  } catch (error) {
    console.log("ERROR in verifyToken: ", error.message);
    res.status(500).send({ message: error.message, error });
  }
};

export default verifyToken;