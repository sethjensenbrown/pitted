//creates an object that holds the key value pairs from the URL query
//should have values for user and jwt 
const query = new URLSearchParams(window.location.search);
const ADMIN_ID = query.get('user');
const JWT = query.get('jwt');
var LATITUDE = 37.09024;
var LONGITUDE = -95.712891;

//function for handling the Google Map
function initMap() {
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
}

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

//requires selection
var getState = () => {
	var state = $('#editor-state option:checked').val();
	if (state != "Select Your State") {
		return state;
	}
	else {
		alert("Please select a state!");
		throw new Error("no state selected");
	}
}

//no verification because radio requires selection by nature
var getDifficulty = () => {
	return $('#editor-difficulty > input[type=radio]:checked').val();
}

//no verification because image URL is not required
var getImageURL = () => {
	return $('#editor-image-url').val();
}

//updates spot on form submit
$('#editor-submit').on('click', (event) => {
	event.preventDefault();
	if (confirm('Are you sure you want to submit?')) { 
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
			success: window.location.href = `/admin-menu?user=${ADMIN_ID}&jwt=${JWT}`
		});
	}
});

//event handler for Go Back to Admin Menu Link click
$('#admin-back').on('click', (event) => {
	event.preventDefault();
	window.location.href= `/admin-menu?user=${ADMIN_ID}&jwt=${JWT}`;
})