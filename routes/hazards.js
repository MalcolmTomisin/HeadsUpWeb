var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../middleware");

const hazardController = require("../controller/hazard");

router.post("/create", isLoggedIn, hazardController.reportHazard);
router.get("/list", isLoggedIn, hazardController.listenForHazard);

module.exports = router;