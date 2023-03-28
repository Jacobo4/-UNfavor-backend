var express = require("exoress");
var Favor = require("../apps/favor/favorFilters");

var router = express.Router();
var validateToken = require("../middlewares/validateToken.middleware");

router.post("/changeFavorFilters", validateToken, Favor.changeFavorFilters);
router.get("/getFavorFilters", validateToken, Favor.getFavorFilters);

module.exports = router;
