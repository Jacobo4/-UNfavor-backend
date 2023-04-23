import express from 'express';

import UserController from './user.controller';
import validateToken from '../authenticate/validateToken.middleware';

const router = express.Router();
router.get("/info", validateToken, UserController.getUser);
router.post("/register", UserController.signup);
router.post("/login", UserController.login);
router.get("/refresh", UserController.refresh);
router.get("/admin", validateToken, UserController.admin);
router.get("/logout", UserController.logout);
router.post("/updateProfile",validateToken, UserController.updateUser);
router.post("/deleteProfile",validateToken, UserController.deleteUser);

export default router;

