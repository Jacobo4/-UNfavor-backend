var express = require("express");
var UserController = require("../controllers/user.controller");

var router = express.Router();
var validateToken = require("../middlewares/validateToken.middleware");

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

module.exports = router;