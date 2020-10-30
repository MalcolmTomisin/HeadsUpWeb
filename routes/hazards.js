var express = require("express");
var router = express.Router();

const hazardController = require("../controller/hazard");

router.post("/create", hazardController.reportHazard);

module.exports = router;