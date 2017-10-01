//first, check for jwt in cookie
const JWT = Cookies.get('jwt');
let ADMIN_ID;

//if JWT exists, extract admin_id
if (JWT) {
	ADMIN_ID = jwt_decode(JWT).user.username
}
//otherwise, redirect to login page
else {
	window.location.href = `/admin`
}

//gets old password
var getOld = () => {
	return $('#old-password').val();
}

//gets first entry for new password
var getNew1 = () => {
	return $('#new-password1').val();
}

//gets second entry for new password
var getNew2 = () => {
	return $('#new-password2').val();
}

//handles form submit
$('#login-submit').on('click', (event) => {
	event.preventDefault();
	var oldPassword = getOld();
	var newPassword1 = getNew1();
	var newPassword2 = getNew2();
	if (newPassword1 === newPassword2) {
		//converts username and password to Base64 for authorization
		var base64encodedData = btoa(ADMIN_ID + ':' + oldPassword);
		//AJAX PUT request uses Basic Auth scheme and sends usename and new password as JSON
		//redirects back to admin menu on success
		$.ajax({
			method: 'PUT',
			url:`/api/users/reset`,
			headers: {'Authorization': 'Basic ' + base64encodedData},
			contentType: 'application/json',
			dataType: 'json',
			data: `{
				"username": "${ADMIN_ID}",
				"password": "${newPassword1}"
			}`,
			success: (res) => {
				alert("Password successfully changed!");
				window.location.href = `/admin-menu`;
			}
		});
	}
	else {
		alert("New passwords do not match. Please try again.");
	}
});

//event handler for Go Back to Admin Menu Link click
$('#admin-back').on('click', (event) => {
	event.preventDefault();
	window.location.href= `/admin-menu`;
})