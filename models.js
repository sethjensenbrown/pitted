const mongoose = require ('mongoose');

const surfSpotsSchema = mongoose.Schema({
	'name': {type: String, required: true},
	'admin-id': {type: String, required: true},
	'difficulty': {type: String, required: true},
	'location': {
		'state': {type: String, required: true},
		'laditude': {type: String, required: true},
		'longitude': {type: String, required: true}
	},
	'image_url': {type: String}
});

const SurfSpots = mongoose.model('SurfSpots', surfSpotsSchema);

module.exports = {SurfSpots};