import express from 'express';

import favorFilters from '../controllers/favorFilters';
import favor from '../controllers/favor';
import validateToken from '../../authenticate/middlewares/validateToken.middleware';

const router = express.Router();

router.post("/changeFavorFilters", validateToken, favorFilters.changeFavorFilters);
router.get("/getFavorFilters", validateToken, favorFilters.getFavorFilters);
router.get("/getFavors", validateToken, favor.getFavors);


export default router;
