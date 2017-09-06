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
	//converts username and password to Base64 for authorization
	var base64encodedData = btoa(user + ':' + password);
	$.ajax({
		method: 'POST',
		url:'/api/auth/login',
		headers: {'Authorization': 'Basic ' + base64encodedData},
		success: res => window.location.href = `/admin-menu?jwt=${res.authToken}&user=${user}`
	});
});