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
	$.ajax({
		method: 'POST',
		url:'https://damp-garden-35226.herokuapp.com/api/auth/login',
		headers: {'Authorization': 'Basic ' + btoa(`${getLogin()}: ${getPassword()}`)},
		success: res => console.log(Success!!)
	});
});