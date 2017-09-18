var SURF_SPOTS;

//gets state from form
var getState = () => {
	return $('#search-state option:checked').val();
}

//gets zip code from form
var getZip = () => {
	return $('#search-zip-code').val();
}

//gets radius from form and returns same value in meters
var getRadius = () => {
	var rad = $('#search-radius option:checked').val();
	//converts to meters
	return (rad*1609);
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
		template.find('.js-template-username').html(spot.admin_id);
		template.find('.js-template-difficulty').html(spot.difficulty);
		template.find('.js-template-state').html(spot.state);
		template.find('.js-template-lad').html(spot.location.coordinates[1]);
		template.find('.js-template-lng').html(spot.location.coordinates[0]);
		//stores new spot element in template_array
		return template;
	})
};

//adds each spot element to DOM
var addHTML = (templateArray) => {
	templateArray.forEach((template, i) => {
		if (i < (this.length/2)) {
			$('#spots-container-a').append(template.html());
		}
		else {
			$('#spots-container-b').append(template.html());
		}

	});
}

//creates a map using Google Map API
var initMap = (_spots) => {
	var spots = _spots;
	var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
    	center: {lat: 38, lng: -19},
  		zoom: 6,
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
        	spots[i].location.coordinates[1], spots[i].location.coordinates[0]);
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

//this function takes an array of spots and turns the search page into a results page
var displayResults = (results) => {
	//hides search form
	$('#search-container').addClass('hidden');
	//generates map with results data
	initMap(results);
	//adds spot info to the DOM
	addHTML(makeTemplateArray(results));
	//displays map and spot info
	$('#results-container').removeClass('hidden');
}

//event listener for search button
$('#search-button').on('click', (event) => {
	event.preventDefault();
	//zip is prioritized over state if both are entered
	if (getZip()) {
		var zip = parseInt(getZip());
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
				//first getJSON request uses the google maps geocoder API 
				//to turn the zip code from the query into a geograpical coordinate 
				$.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip},USA`, (results) => {
					//second getJSON request queries pitted API for all surf spots
					//withing the given radius of the geogrphical coordinate figured above
					//returns JSON response of those spots found
					$.getJSON(`/api/geo?longitude=${results.results[0].geometry.location.lng}&laditude=${results.results[0].geometry.location.lat}&radius=${getRadius()}`, (results) => {
						//if no results are returned it throws error and alert window
						if (results.length < 1) {
							alert('No spots were found, please try again');
							throw new Error('no spots found');
						}
						//if results are returned it disaplys them on the page
						else {
							displayResults(results);
						}
					});
				});
				
			}
		}
	}
	//if no zip is entered, the seacrh is based on the spot's state
	//getJSON request to pitted API returns all spots in that state
	else {
		$.getJSON('/api/state?state=' + getState(), (results) => {
			//if no results are returned it throws error and alert window
			if (results.length < 1) {
				alert('No spots were found, please try again');
				throw new Error('no spots found');
			}
			//if results are returned it disaplys them on the page
			else {
				displayResults(results);
			}
		});
	}
});

//event handler for Go Back and Search Again Link click
$('#search-again').on('click', (event) => {
	event.preventDefault();
	window.location.reload(true);
})