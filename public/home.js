var SURF_SPOTS;

//gets state from form
var getState = () => {
	return $('#search-state option:checked').val();
}

//gets zip code from form
var getZip = () => {
	return $('#search-zip-code').val();
}

//gets radius from form
var getRadius = () => {
	return $('#search-radius option:checked').val();
}

//creates array that holds spot elements
var makeTemplateArray = (data) => {
	return data.map((spot) => {
		//spot elements based on template in admin-menu.html file
		var template = $('#spot-template').clone();
		//original template is hidden
		template.removeClass('hidden');
		//replaces template values with spot values
		template.find('.js-template-name').html(spot.name);
		template.find('.js-template-img').attr("src", spot.image_url);
		template.find('.js-template-username').html(spot["admin-id"]);
		template.find('.js-template-difficulty').html(spot.difficulty);
		template.find('.js-template-state').html(spot.location.state);
		template.find('.js-template-lad').html(spot.location.laditude);
		template.find('.js-template-lng').html(spot.location.longitude);
		//stores new spot element in template_array
		return template;
	})
};

//adds each spot element to DOM
var addHTML = (templateArray) => {
	templateArray.forEach((template) => {
		$('#spots-container').append(template.html());
	});
}

//creates a map using Google Map API
var initMap = (_spots) => {
	var spots = _spots;
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
    for( i = 0; i < spots.length; i++ ) {
        var position = new google.maps.LatLng(
        	spots[i].location.laditude, spots[i].location.longitude);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: spots[i][name]
        });
        
        //creates an info window for each marker   
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(
                	`<h5>${spots[i].name}</h5>
                	 <p>This spot is ${spots[i].difficulty}</p>`
                	);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        //automatically centers the map fitting all markers on the screen
        map.fitBounds(bounds);
    }
}

var displayResults = (results) => {
	$('#search-container').addClass('hidden');
	initMap(results);
	addHTML(makeTemplateArray(results));
	$('#results-container').removeClass('hidden');
}

//event listener for search button
$('#search-button').on('click', (event) => {
	event.preventDefault();
	//zip is prioritized over state if both are entered
	if (getZip()) {
		var zip = parseInt(getZip());
		console.log(zip);
		//checks to make sure zip code is valid
		if (!(/^\d{5}(-\d{4})?(?!-)$/.test(zip))) {
			alert('Please enter a valid 5-digit zip code. (hint: no spaces)');
			throw new Error("invalid zip code - wrong length");
		}
		else{
			//checks to make sure radius is selected for zip
			if(getRadius() === 'Select search radius') {
				alert('Please select a search radius');
				throw new Error('no search radius selected');
			}
			else {
				console.log(`Find all spots within ${getRadius()} miles of ${getZip()}`)
			}
		}
	}
	else {
		console.log(`Find all spots in ${getState()}`);
		$.getJSON('https://damp-garden-35226.herokuapp.com/results/state/' + getState(), (results) => {
			displayResults(results);
		});
	}
})