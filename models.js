const mongoose = require ('mongoose');

const surfSpotsSchema = mongoose.Schema({
	'name': {type: String, required: true},
	'admin_id': {type: String, required: true},
	'difficulty': {type: String, required: true},
	'state': {type: String, required: true},
	'location': {
		'type': {type: String, required: true},
		'coordinates': {type: Array, required: true}
	},
	'image_url': {type: String}
});

const SurfSpots = mongoose.model('SurfSpots', surfSpotsSchema);

module.exports = {SurfSpots};