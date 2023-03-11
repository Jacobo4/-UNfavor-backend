var express = require("express");
var ProjectController = require("../controllers/test.ts");

var router = express.Router();

router.get("/", ProjectController.home);
router.get("/test/:id?", ProjectController.test);
router.post("/test-db", ProjectController.testDB);

module.exports = router;