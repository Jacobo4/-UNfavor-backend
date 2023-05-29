import express from 'express';

import favorFilters from './favorFilters.controller';
import favor from './favor.controller';
import validateToken from "../authenticate/validateToken.middleware";

const router = express.Router();

router.get("/favorFilters", validateToken, favorFilters.getFavorFilters);
router.get("/favors", validateToken, favor.getFavors);
router.put("/likeFavor", validateToken,  favor.likeFavor);
router.post("/recommendFavors", validateToken, favor.recommendFavors);
router.post("/changeFavorFilters", validateToken, favorFilters.changeFavorFilters);

export default router;
