import express from 'express';

import favorFilters from '../favorFilters';
import validateToken from '../../authenticate/middlewares/validateToken.middleware';

const router = express.Router();

router.post("/changeFavorFilters", validateToken, favorFilters.changeFavorFilters);
router.get("/getFavorFilters", validateToken, favorFilters.getFavorFilters);

export default router;
