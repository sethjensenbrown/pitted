const MOCK_DATA = {
	spots: [
			{"id": "11111111", "name": "Extreme River Wave", "admin-id": "river_surfer_1", "difficulty": "EXTREME!", "state": "CO", "location": {"type": "Point", "coordinates": [14.70368, 37.83460 ]}, "image_url": "http://riverbreak.com/wp-content/uploads/River-Drop-and-Flow-620x350.jpg"},
			{"id": "22222222", "name": "Chill Paddleboarding Spot", "admin-id": "sup_for_life", "difficulty": "Super Chill", "state": "MI", "location": {"type": "Point", "coordinates": [-132.11670, 31.51845]}, "image_url": "https://s-media-cache-ak0.pinimg.com/originals/8d/bb/31/8dbb31176190e835cd22d777e718c98a.jpg"},
			{"id": "33333333", "name": "Best PHX Wake Surf Lake", "admin-id": "mastercraft_mike", "difficulty": "Chill", "state": "AZ", "location": {"type": "Point", "coordinates": [10.85522, -31.14076]}, "image_url": "http://wac.450f.edgecastcdn.net/80450F/tri1025.com/files/2013/08/IMG_9169-630x472.jpg"},
			{"id": "44444444", "name": "Sky Surfer's Unite", "admin-id": "air_rider", "difficulty": "EXTREME!", "state": "CA", "location": {"type": "Point", "coordinates": [63.03260, -56.01832]}, "image_url": "http://www.nzoneskydive.co.nz/Portals/19/Images/media/1_Skysurfing%20over%20Queenstown%20with%20NZONE's%20Sasa%20Jojic.JPG"},
			{"id": "55555555", "name": "Perfect Wave Every Time", "admin-id": "kelly_slater", "difficulty": "Intermediate", "state": "TX", "location": {"type": "Point", "coordinates": [174.73297, -29.67161]}, "image_url": "https://www.surfertoday.com/images/stories/surfingtyphoonlagoon.jpg"}
		   ]
};

//creates array that holds spot elements
var template_array = MOCK_DATA.spots.map((spot) => {
	//spot elements based on template in admin-menu.html file
	var template = $('#spot-template').clone();
	//original template is hidden
	template.removeClass('hidden');
	//replaces template values with spot values
	template.find('.js-template-name').html(spot.name);
	template.find('.js-template-img').attr("src", spot.image_url);
	template.find('.js-template-username').html(spot["admin-id"]);
	template.find('.js-template-difficulty').html(spot.difficulty);
	template.find('.js-template-state').html(spot.state);
	template.find('.js-template-lad').html(spot.location.coordinates[1]);
	template.find('.js-template-lng').html(spot.location.coordinates[0]);
	//stores spot id in EDIT and DELETE links for easy access later
	template.find('.js-spot-edit').attr("value", spot.id);
	template.find('.js-spot-delete').attr("value", spot.id);
	//stores new spot element in template_array
	return template;
})

//adds each spot element to DOM
template_array.forEach((template) => {
	$('#spots-container').append(template);
})

//event listener for EDIT THIS SPOT link
$('#spots-container').on('click', '.js-spot-edit', (event) => {
	//gets spot id stored in link element
	var id = $(event.target).attr("value");
	//API rquest goes here:
	console.log(`Link to update spot with id: ${id}`);
})

//event listener for DELETE THIS SPOT link
$('#spots-container').on('click', '.js-spot-delete', (event) => {
	//gets spot id stored in link element
	var id = $(event.target).attr("value");
	//API rquest goes here:
	if (confirm("Are you sure you want to delete this spot?")) {
		console.log(`Link to delete spot with id: ${id}`);
	}
})

//event listener for ADD A NEW SPOT link
$('.js-spot-add').on('click', (event) => {
	//API request goes here:
	console.log(`Link to add spot`);
})



