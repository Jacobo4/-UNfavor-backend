import express from 'express';

import matchController from "./match.controller";
import validateToken from "../authenticate/validateToken.middleware";

const router = express.Router();

router.put("/action", validateToken,  matchController.controlMatch);

export default router;