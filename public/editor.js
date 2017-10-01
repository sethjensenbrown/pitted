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

//gets spot id from url query 
const query = new URLSearchParams(window.location.search);
const SPOT_ID = query.get('_id');
var LATITUDE = 37.09024;
var LONGITUDE = -95.712891;

//handles Google Map
var initMap = () => {
	var map;
    var mapOptions = {
        mapTypeId: 'roadmap',
        center: {lat: LATITUDE, lng: LONGITUDE},
  		zoom: 3
    };
                    
    //displays a map on the page with marker in center
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    map.setTilt(45);
    marker = new google.maps.Marker({position: {lat: LATITUDE, lng: LONGITUDE}, map: map});

    //on click, displays new marker at click and centers map on marker
    //also updates LATITUDE and LONGITUDE globals to click location
    google.maps.event.addListener(map, 'click', function(event) {
    	//resets marker so there's ever only one marker on map
    	LATITUDE = event.latLng.lat();
    	LONGITUDE = event.latLng.lng();
    	if (marker != null) {
    		marker.setMap(null);
    	}
		marker = new google.maps.Marker({position: event.latLng, map: map});
		map.panTo(event.latLng);
	});
};

//gets spot matching the id passed in the url to preload info to be edited in form elements
//then loads them into form elements and initializes Google Map
var prefillForms = () => {
	$.getJSON(`/api/spot_id?_id=${SPOT_ID}&jwt=${JWT}`, res => {
		//preload all fields with current values in database
		EDIT_SPOT = res[0];
		LATITUDE = parseFloat(EDIT_SPOT.location.coordinates[1]);
		LONGITUDE = parseFloat(EDIT_SPOT.location.coordinates[0]);
		$('#editor-spot-name').val(EDIT_SPOT.name);
		$(`option[value='${EDIT_SPOT.state}']`).prop('selected', true);
		$(`input[type='radio'][value='${EDIT_SPOT.difficulty}']`).attr('checked', 'checked');
		$('#editor-image-url').val(EDIT_SPOT.image_url);
		initMap();
	});
};

//completes action once page is loaded
$(() => {
	//logic checks to see if SPOT_ID is present in URL to preload forms
	if (SPOT_ID) {
		prefillForms();
	}
	else {
		initMap();
	}
});


//requires user to enter a spot name
var getSpotName = () => {
	var spotName = $('#editor-spot-name').val();
	if (spotName) {
		return spotName;
	}
	else {
		alert("Please enter a spot name!");
		throw new Error("no spot name entered");
	}
}

//no verification becuase selector requires selection by nature
var getState = () => {
	return $('#editor-state option:checked').val();
}

//no verification because radio requires selection by nature
var getDifficulty = () => {
	return $('#editor-difficulty > input[type=radio]:checked').val();
}

//no verification because image URL is not required
var getImageURL = () => {
	return $('#editor-image-url').val();
}

var editSpot = () => {
	var updatedSpot = `{
		"_id": "${query.get('_id')}",
		"name": "${getSpotName()}",
		"state": "${getState()}",
		"location": {
			"type": "Point",
			"coordinates": [${LONGITUDE}, ${LATITUDE}]
		},
		"difficulty": "${getDifficulty()}",
		"image_url": "${getImageURL()}"
	}`;
	//PUT request to server to update the spot
	$.ajax({
		url: `/api/edit?_id=${SPOT_ID}&jwt=${JWT}`,
		method: 'PUT',
		contentType: 'application/json',
		dataType: 'json',
		data: updatedSpot,
		success: window.location.href = `/admin-menu`
	});
}

var addSpot = () => {
	var newSpot = `{
		"name": "${getSpotName()}",
		"state": "${getState()}",
		"location": {
			"type": "Point",
			"coordinates": [${LONGITUDE}, ${LATITUDE}]
		},
		"difficulty": "${getDifficulty()}",
		"image_url": "${getImageURL()}",
		"admin_id": "${ADMIN_ID}"
	}`;
	//PUT request to server to update the spot
	$.ajax({
		url: `/api/add?jwt=${JWT}`,
		method: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: newSpot,
		success: window.location.href = `/admin-menu`
	});
}

//updates spot on form submit
$('#editor-submit').on('click', (event) => {
	event.preventDefault();
	//cretes string representation of JSON data to sumbit for the update
	//grabs all form values at time of submit
	if (confirm('Are you sure you want to submit?')) { 
		if (SPOT_ID) {
			editSpot();
		}
		else {
			addSpot();
		}
	};
});

//event handler for Go Back to Admin Menu Link click
$('#admin-back').on('click', (event) => {
	event.preventDefault();
	window.location.href= `/admin-menu`;
})