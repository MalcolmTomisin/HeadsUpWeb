/* eslint-disable no-undef */

const staging = process.env.NODE_ENV == "staging" ? true : false;
let dbName = staging
	? process.env.DB_NAME_STAGING || "test"
	: process.env.DB_NAME || "test";
let port = staging
	? process.env.API_PORT_STAGING || 5000
	: process.env.API_PORT || 5000;

module.exports = {
	api: {
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USER || "root",
		pass: process.env.DB_PASS || "Notheadsuppass2000",
		db: dbName,
		port: port,
	},
	jwt: {
		secret: process.env.JWT_SECRET || "changethistoanenvvariablelateron",
	},
};
