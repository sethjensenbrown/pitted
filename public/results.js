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
	//stores new spot element in template_array
	return template;
})

//adds each spot element to DOM
template_array.forEach((template) => {
	$('#spots-container').append(template);
})

//creates a map using Google Map API
function initMap() {
	var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
    	center: {lat: 38, lng: -19},
  		zoom: 3,
        mapTypeId: 'roadmap'
    };
                    
    //displays a map on the page
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    map.setTilt(45);
        
    //displays multiple markers on the map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    //loops through the array of spots & places each one on the map  
    for( i = 0; i < MOCK_DATA.spots.length; i++ ) {
        var position = new google.maps.LatLng(
        	MOCK_DATA.spots[i].location.coordinates[1], MOCK_DATA.spots[i].location.coordinates[0]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: MOCK_DATA.spots[i][name]
        });
        
        //creates an info window for each marker   
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(
                	`<h5>${MOCK_DATA.spots[i].name}</h5>
                	 <p>This spot is ${MOCK_DATA.spots[i].difficulty}</p>`
                	);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        //automatically centers the map fitting all markers on the screen
        map.fitBounds(bounds);
    }
}






