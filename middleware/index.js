const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = {
	// check if token sent is a token of user currently logged in
	isLoggedIn: (req, res, next) => {
		let { token } = req.headers;
		if (!token) {
			return res
				.status(403)
				.json({ error: "You do not have authorization to do that." });
		}
		jwt.verify(token, config.jwt.secret, (err, decidedToken) => {
			if (err)
				return res
					.status(403)
					.json({ error: "Invalid or malformed token" });
			if (!decidedToken)
				return res.status(403).json({ error: "Not authorized" });
			req.id = decidedToken.id;
			req.email = decidedToken.email;
			return next();
		});
	}
};