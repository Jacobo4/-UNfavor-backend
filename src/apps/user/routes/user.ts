import express from 'express';

import UserController from '../controllers/user.controller';
import validateToken from '../../authenticate/middlewares/validateToken.middleware';

const router = express.Router();
router.get("/user", async (req, res) => {
    res.status(200).send({
        message: "User Testing"
    });
});
router.post("/register", UserController.signup);
router.post("/login", UserController.login);
router.get("/refresh", UserController.refresh);
router.get("/admin", validateToken, UserController.admin);
router.get("/logout", UserController.logout)

export default router;

