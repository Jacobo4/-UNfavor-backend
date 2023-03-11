'use strict'

var express = require("express");
var ProjectController = require("../controllers/test.ts");

var router = express.Router();

router.get("/", ProjectController.home);
router.get("/test/:id?", ProjectController.test);

module.exports = router;