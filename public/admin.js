//first, check for jwt in cookie
const JWT = Cookies.get('jwt');

//if JWT exists, redirects to admin-menu
if (JWT) {
	window.location.href = `/admin-menu`
}

//then checks for failed login parameter in url
const query = new URLSearchParams(window.location.search);
const login = query.get('login');
if (login === "failed") {
	alert("Login failed, please try again.");
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
		//if successful, creates a cookie for the jwt and redirects to admin-menu
		success: (res) => {
			Cookies.set('jwt', `${res.authToken}`);
			window.location.href = `/admin-menu`
		}
	});
});