import express from 'express';

// import favorFilters from './favorFilters.controller';
import favor from './favor.controller';
import validateAdmin from '../authenticate/validateAdmin.middleware';

const router = express.Router();

// router.post("/changeFavorFilters", validateToken, favorFilters.changeFavorFilters);
// router.get("/favorFilters", validateToken, favorFilters.getFavorFilters);
router.get("/favors", validateAdmin, favor.getFavors);

export default router;