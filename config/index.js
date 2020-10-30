/* eslint-disable no-undef */
const Twilio = require("twilio");
const redis = require("redis");
const hazardPublisher = redis.createClient();
const AWS = require("aws-sdk");
const { AWS_ID, AWS_SECRET_KEY } = require("../util/keys");
const S3 = new AWS.S3({
	accessKeyId: AWS_ID,
	secretAccessKey: AWS_SECRET_KEY,
});



const staging = process.env.NODE_ENV == "staging" ? true : false;
let dbName = staging
	? process.env.DB_NAME_STAGING || "test"
	: process.env.DB_NAME || "test";
let port = staging
	? process.env.API_PORT_STAGING || 5000
	: process.env.API_PORT || 5000;
	
// Check configuration variables
if (process.env.TWILIO_API_KEY == null ||
		process.env.TWILIO_API_SECRET == null ||
		process.env.TWILIO_ACCOUNT_SID == null ||
		process.env.VERIFICATION_SERVICE_SID == null ||
		process.env.COUNTRY_CODE == null) {
	console.log("Please copy the .env.example file to .env, " +
										"and then add your Twilio API Key, API Secret, " +
										"and Account SID to the .env file. " +
										"Find them on https://www.twilio.com/console");
	process.exit();
}

if (process.env.APP_HASH == null) {
	console.log("Please provide a valid Android app hash, " + "in the .env file");
	process.exit();
}

if (process.env.CLIENT_SECRET == null) {
	console.log(
		"Please provide a secret string to share, " +
      "between the app and the server " +
      "in the .env file"
	);
	process.exit();
}

configuredClientSecret = process.env.CLIENT_SECRET;

// Initialize the Twilio Client
const twilioClient = new Twilio(process.env.TWILIO_API_KEY,
	process.env.TWILIO_API_SECRET,
	{ accountSid: process.env.TWILIO_ACCOUNT_SID });
	
const SMSVerify = require("./SMSVerify.js");

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
	twilio: {
		configuredClientSecret: process.env.CLIENT_SECRET || "",
		smsVerify: new SMSVerify(
			twilioClient,
			process.env.APP_HASH,
			process.env.VERIFICATION_SERVICE_SID,
			process.env.COUNTRY_CODE
		)
	},
	hazardPublisher,
	BUCKET_NAME: "headsupbucket",
	S3
};
