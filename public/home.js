//gets state from form
var getState = () => {
	return $('#search-state option:checked').val();
}

//gets zip code from form, checks for valid length
var getZip = () => {
	var zip = $('#search-zip-code').val();
	if (zip.length != 5) {
		alert('Please enter a valid 5-digit zip code. (hint: no spaces)');
		throw new Error("invalid zip code");
	}
	else {
		return zip;
	}
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
		//checks to make sure radius is selected for zip
		if(getRadius() === 'Select search radius') {
			alert('Please select a search radius');
			throw new Error('no search radius selected');
		}
		else {
			console.log(`Find all spots within ${getRadius()} miles of ${getZip()}`)
		}
	}
	else {
		console.log(`Find all spots in ${getState()}`);
	}
})