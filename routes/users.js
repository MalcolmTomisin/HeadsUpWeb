var express = require("express");
var router = express.Router();
const userController = require("../controller/user");

/* GET users listing. */
router.get("/", function(req, res) {
	res.send("respond with a resource");
});

router.post("/verify", userController.verifyUser);
router.post("/otp", userController.sendOneTimeCode);
router.post("/verifyOtp", userController.verifyOneTimeCode);


module.exports = router;
