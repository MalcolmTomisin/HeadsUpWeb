/* eslint-disable no-unused-vars */
"use strict";
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = require("../util/keys");
const config = require("../config");
const { User } = require("../model");
const sequelize = require("../config/database");
const jsonBodyParser = require("body-parser").json();
const {smsVerify} = require("../config").twilio;

module.exports = {
	verifyUser: (req, res, next) => {
		//recieve token from mobile client
		const client = new OAuth2Client(CLIENT_ID);
		const form = req.body;
		const token = form.token;
		async function verify() {
			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
				// Or, if multiple clients access the backend:
				//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
			});
			const payload = ticket.getPayload();
			const userid = payload["sub"];

			return payload;
			// If request specified a G Suite domain:
			// const domain = payload['hd'];
		}
		verify()
			.then(ticketPayload => {
				User.findOne({ where: { email: ticketPayload["email"] } })
					.then(async (exist) => {
						if (!exist) {
							sequelize
								.sync()
								.then(() =>
									User.create({
										firstName: ticketPayload["given_name"],
										lastName: ticketPayload["family_name"],
										email: ticketPayload["email"],
										picture: ticketPayload["picture"],
									})
								)
								.then(async (data) => {
									let user = data.get();
									let token = await jwt.sign(
										{ id: user.id, email: user.email },
										config.jwt.secret
									);
									if (token) {
										res.status(200).json({ success: true, user, token });
									} else {
										res.status(500).json({
											success: false,
											status: "Could not generate an auth token",
										});
									}
								})
								.catch(next);
						} else {
							let user = exist.get();
							let token = await jwt.sign(
								{ id: user.id, email: user.email },
								config.jwt.secret
							);
							if (token) {
								res.status(200).json({ success: true, token });
							} else {
								res.status(500).json({
									success: false,
									status: "Could not generate an auth token",
								});
							}
						}
					})
					.catch(next);
			})
			.catch(next);
	},
	sendOneTimeCode : (req, res, next) => {
		const clientSecret = req.body.client_secret;
		const phone = req.body.phone;
		
		if (clientSecret == null || phone == null) {
			// send an error saying that both client_secret and phone are required
			res
				.status(500)
				.json({ message: "Both client_secret and phone are required." });
			return;
		}

		if (config.twilio.configuredClientSecret != clientSecret) {
			res.status(500).json({message: "The client_secret parameter does not match."});
			return;
		}

		smsVerify.request(phone);
		res.status(200).json({ success: true });

	},
	verifyOneTimeCode: (req, res, next) => {
		const clientSecret = req.body.client_secret;
		const phone = req.body.phone;
		const smsMessage = req.body.sms_message;
		
		if (clientSecret == null || phone == null || smsMessage == null) {
			res
				.status(500)
				.json({
					message:
            "The client_secret, phone, and sms_message parameters are required",
				});
			return;
		}
		if (config.twilio.configuredClientSecret != clientSecret) {
			res
				.status(500)
				.json({ message: "The client_secret parameter does not match." });
			return;
		}
	}
};


