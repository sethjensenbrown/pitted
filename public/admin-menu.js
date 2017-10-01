//first, check for jwt in cookie
const JWT = Cookies.get('jwt');
let ADMIN_ID;

//if JWT exists, extract admin_id
if (JWT) {
	ADMIN_ID = jwt_decode(JWT).user.username
}
//otherwise, redirect to login page
else {
	window.location.href = `/admin`
}

/*
//creates an object that holds the key value pairs from the URL query
//should have values for user and jwt 
const query = new URLSearchParams(window.location.search);
const ADMIN_ID = query.get('user');
const JWT = query.get('jwt');
*/

//gets and displays all spot info for spots created by user that logs in
$.getJSON(`/api/admin_id?admin_id=${ADMIN_ID}&jwt=${JWT}`, res => {
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

	//adds each spot element to DOM into two columns
	template_array.forEach((template, i, template_array) => {
		if (i < (template_array.length/2)) {
			$('#spots-container-a').append(template.html());
		}
		else {
			$('#spots-container-b').append(template.html());
		}

	});
});

//event listener for EDIT THIS SPOT link
$('#spots-container').on('click', '.js-spot-edit', (event) => {
	//gets spot id stored in link element
	var id = $(event.target).attr("value");
	//redirect to editor with spot id sent via the URL
	window.location.href = `/editor?_id=${id}&user=${ADMIN_ID}&jwt=${JWT}`;
});

//event listener for DELETE THIS SPOT link
$('#spots-container').on('click', '.js-spot-delete', (event) => {
	//gets spot id stored in link element
	var id = $(event.target).attr("value");
	//API rquest goes here:
	if (confirm("Are you sure you want to delete this spot?")) {
		$.ajax({
			url: `/api/delete?_id=${id}&jwt=${JWT}`,
			method: 'DELETE',
			success: window.location.reload(true)
		})
	}
});

//event listener for ADD A NEW SPOT link
$('.js-spot-add').on('click', (event) => {
	//redirect to add page
	window.location.href = `/editor?user=${ADMIN_ID}&jwt=${JWT}`;
});

//event listener for RESET PASSWORD link
$('.js-reset').on('click', (event) => {
	//redirect to add page
	window.location.href = `/reset?user=${ADMIN_ID}&jwt=${JWT}`;
});

//redirects to home page when logo is clicked
$('#logo').on('click', (event) => {
	event.preventDefault();
	window.location.href = `/`;
})

