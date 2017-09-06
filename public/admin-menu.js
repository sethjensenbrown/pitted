//creates an object that holds the key value pairs from the URL query
//should have values for user and jwt 
const query = new URLSearchParams(window.location.search);

//gets and displays all spot info for spots created by user that logs in
$.getJSON(`/api/admin_id?admin_id=${query.get('user')}`, res => {
	//stores all spot info for the user in SPOT_DATA
	const SPOT_DATA = [];
	res.map(spot => SPOT_DATA.push(spot));

	//creates array that holds spot elements
	var template_array = SPOT_DATA.map((spot) => {
		//spot elements based on template in admin-menu.html file
		var template = $('#spot-template').clone();
		//original template is hidden
		template.removeClass('hidden');
		//replaces template values with spot values
		template.find('.js-template-name').html(spot.name);
		template.find('.js-template-img').attr("src", spot.image_url);
		template.find('.js-template-username').html(spot.admin_id);
		template.find('.js-template-difficulty').html(spot.difficulty);
		template.find('.js-template-state').html(spot.state);
		template.find('.js-template-lad').html(spot.location.coordinates[1]);
		template.find('.js-template-lng').html(spot.location.coordinates[0]);
		//stores spot id in EDIT and DELETE links for easy access later
		template.find('.js-spot-edit').attr("value", spot._id);
		template.find('.js-spot-delete').attr("value", spot._id);
		//stores new spot element in template_array
		return template;
	});

	//adds each spot element to DOM
	template_array.forEach((template) => {
		$('#spots-container').append(template);
	});
});

//event listener for EDIT THIS SPOT link
$('#spots-container').on('click', '.js-spot-edit', (event) => {
	//gets spot id stored in link element
	var id = $(event.target).attr("value");
	//API rquest goes here:
	console.log(`Link to update spot with id: ${id}`);
});

//event listener for DELETE THIS SPOT link
$('#spots-container').on('click', '.js-spot-delete', (event) => {
	//gets spot id stored in link element
	var id = $(event.target).attr("value");
	//API rquest goes here:
	if (confirm("Are you sure you want to delete this spot?")) {
		console.log(`Link to delete spot with id: ${id}`);
	}
});

//event listener for ADD A NEW SPOT link
$('.js-spot-add').on('click', (event) => {
	//API request goes here:
	console.log(`Link to add spot`);
});



