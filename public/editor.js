var MOCK_SPOT = {
	"id": "11111111",
	"name": "Extreme River Wave",
	"admin-id": "river_surfer_1",
	"difficulty": "5",
	"location": {
		"state": "CO",
		"latitude": "37.09024",
		"longitude": "-95.712891"
				}, 
	"image_url": "http://riverbreak.com/wp-content/uploads/River-Drop-and-Flow-620x350.jpg" 
	}

var LATITUDE = 37.09024;
var LONGITUDE = -95.712891;

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

var getSpotName = () => {
	return $('#editor-spot-name').val();	
}

var getState = () => {
	return $('#editor-state option:checked').val();
}

var getDifficulty = () => {
	return $('#editor-difficulty > input[type=radio]:checked').val();
}

var getImageURL = () => {
	return $('#editor-image-url').val();
}

//updates spot on form submit
//change to $('#editor-form').submit when adding API
$('#editor-submit').on('click', (event) => {
	event.preventDefault();
	console.log(`{
		name: ${getSpotName()},
		location: {
			state: ${getState()},
			latitude: ${LATITUDE},
			longitude: ${LONGITUDE}
		},
		difficulty: ${getDifficulty()},
		image_url: ${getImageURL()}
	}`);
	//API request will go here!
})



