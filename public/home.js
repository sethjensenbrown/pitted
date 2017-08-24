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
	}
})