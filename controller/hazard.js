const { Hazard, Image } = require("../model");
const { hazardPublisher } = require("../config");



module.exports = {
	reportHazard: (req, res, next) => {
		const formData = req.body;
		if (!formData.coords) {
			return res.status(400).json({ message: "No location object sent" });
		}
		const { coords, type, url } = formData;
		let location = { type: "Point", coordinates: [coords.longitude, coords.latitude] };
		Hazard.create({ location, type, userId: req.userId }).then((hazard) => {
			if (hazard) {
				Image.create({ url, hazardId: hazard.id }).then(
					(image) => {
						if (image) {
							res
								.status(200)
								.json({ success: true});
						}
					}
				);
			}
		}).catch(next);
		const hazardInfo = {
			location: {
				longitude: coords.longitude,
				latitude: coords.latitude
			},
			url,
			user: req.user
		};
		hazardPublisher.publish("hazard", JSON.stringify({hazardInfo}));
        
	}
};