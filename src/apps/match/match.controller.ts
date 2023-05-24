import { Request, Response } from 'express';
import { RequestWithUser } from '../typescriptCrap/requestWithUser';
import matchService from "./match.service";

const matchController = {
  controlMatch: async function(req: RequestWithUser, res: Response){
    try{
      if(!req.user) throw new Error("No user info");
      if(!req.body.matchId || !req.body.option) throw new Error("No match info");
      let action;
      if(req.body.option=='accept') action = await matchService.acceptMatch(req.user.id, req.body.matchId);
      else if(req.body.option=='reject') action = await matchService.rejectMatch(req.user.id, req.body.matchId);
      else throw new Error("Unknown option");
      if(!action) throw new Error("ControlMatch error");
      return res.status(200).send({ message: "Match changed", match: action });
    }catch(error){
      console.log("ERROR in controlMatch");
      return res.status(500).send({ message: error.message, error });
    }
  }
}

export default matchController;