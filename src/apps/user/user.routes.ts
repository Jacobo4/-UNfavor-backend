import express, { Router } from 'express';

import UserController from './user.controller';
import AdminController from './admin.controller';
import validateToken from '../authenticate/validateToken.middleware';
import validateAdmin from '../authenticate/validateAdmin.middleware';

const router: Router = express.Router();

router.get("/info", validateToken, UserController.getUser);
router.get("/logout", UserController.logout);
router.get("/stalk", validateToken, UserController.seeProfile);
router.post("/register", UserController.signup);
router.post("/login", UserController.login);
router.post("/refresh", UserController.refresh);
router.put("/updateProfile",validateToken, UserController.updateUser);
router.delete("/deleteProfile",validateToken, UserController.deleteUser);


router.get("/admin", validateAdmin, AdminController.admin);
router.get("/users", validateAdmin, AdminController.getUsers);
router.put("/controlFavor", validateAdmin, AdminController.controlFavor);
router.get("/statistics", validateAdmin, AdminController.statistics);

//router.post("/post", validateToken, UserController.post);

export default router;
