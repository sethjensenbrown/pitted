//first, check for jwt in cookie
const JWT = Cookies.get('jwt');

//if JWT exists, redirects to admin-menu
if (JWT) {
	let user = jwt_decode(JWT).user.username;
	//window.location.href = `/admin-menu?jwt=${JWT}&user=${user}`
}

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
		success: (res) => {
			Cookies.set('jwt', `${res.authToken}`);
			window.location.href = `/admin-menu?jwt=${res.authToken}&user=${user}`
		}
	});
});

//redirects to home page when logo is clicked
$('#logo').on('click', (event) => {
	event.preventDefault();
	window.location.href = `/`;
})