import express, { Router } from 'express';

import AdminController from '../admin/admin.controller';
import validateAdmin from '../authenticate/validateAdmin.middleware';

const router: Router = express.Router();

router.get("/users", validateAdmin, AdminController.getUsers);
router.get("/statistics", validateAdmin, AdminController.statistics);
router.get("/reports", validateAdmin, AdminController.getReports);
router.put("/controlFavor", validateAdmin, AdminController.controlFavor);

export default router;