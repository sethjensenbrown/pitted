//gets admin login id
var getLogin = () => {
	return $('#login-id').val();
}

//gets password
var getPassword = () => {
	return $('#login-password').val();
}

//handles form submit
$('#login-submit').on('click', (event) => {
	event.preventDefault();
	var user = getLogin();
	var password = getPassword();
	var base64encodedData = btoa(user + ':' + password);
	console.log(`user: ${user}`);
	console.log(`password: ${password}`);
	console.log(`base64encodedData: ${base64encodedData}`)
	$.ajax({
		method: 'POST',
		url:'https://damp-garden-35226.herokuapp.com/api/auth/login',
		headers: {'Authorization': 'Basic ' + base64encodedData},
		success: res => window.location.href = `/admin-menu?jwt=${res.authToken}`
	});
});