import express, { Router } from 'express';

import UserController from './user.controller';
import validateToken from '../authenticate/validateToken.middleware';
import validateAdmin from '../authenticate/validateAdmin.middleware';

const router: Router = express.Router();

router.get("/info", validateToken, UserController.getUser);
router.get("/admin", validateAdmin, UserController.admin);
router.get("/logout", UserController.logout);
router.post("/register", UserController.signup);
router.post("/login", UserController.login);
router.post("/refresh", UserController.refresh);
router.put("/updateProfile",validateToken, UserController.updateUser);
router.delete("/deleteProfile",validateToken, UserController.deleteUser);

export default router;