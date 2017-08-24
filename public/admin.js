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
	console.log(`username: ${getLogin()}`);
	console.log(`password: ${getPassword()}`);
})