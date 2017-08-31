var MOCK_SPOT = {
		"id": "11111111", 
		"name": "Extreme River Wave", 
		"admin-id": "river_surfer_1", 
		"difficulty": "EXTREME!", "state": "CO", 
		"location": {"type": "Point", "coordinates": [14.70368, 37.83460 ]}, 
		"image_url": "http://riverbreak.com/wp-content/uploads/River-Drop-and-Flow-620x350.jpg"
};


//preload all fields with current values in database
var LATITUDE = parseFloat(MOCK_SPOT.location.coordinates[1]);
var LONGITUDE = parseFloat(MOCK_SPOT.location.coordinates[0]);
$('#editor-spot-name').val(MOCK_SPOT.name);
$(`option[value='${MOCK_SPOT.state}'`).attr('selected', 'selected');
$(`input[type='radio'][value='${MOCK_SPOT.difficulty}'`).attr('checked', 'checked');
$('#editor-image-url').val(MOCK_SPOT.image_url);

//handles Google Map
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

//updates spot on form submit
//change to $('#editor-form').submit when adding API
$('#editor-submit').on('click', (event) => {
	event.preventDefault();
	if (confirm('Are you sure you want to submit?')) { 
		console.log(`{
			name: ${getSpotName()},
			state: ${getState()},
			location: {
				type: "Point",
				coordinates: [${LONGITUDE}, ${LATITUDE}]
			},
			difficulty: ${getDifficulty()},
			image_url: ${getImageURL()}
		}`);
	}
	//API request will go here!
})



