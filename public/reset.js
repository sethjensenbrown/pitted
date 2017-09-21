//creates an object that holds the key value pairs from the URL query
//should have values for user, and jwt 
const query = new URLSearchParams(window.location.search);
const ADMIN_ID = query.get('user');
const JWT = query.get('jwt');

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
		var base64encodedData = btoa(ADMIN_ID + ':' + newPassword1);
		//AJAX PUT request uses Basic Auth scheme and sends usename and new password as JSON
		//redirects back to admin menu on success
		console.log(`username: ${ADMIN_ID}, password: ${newPassword1}`);
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
			success: res => window.location.href = `/admin-menu?jwt=${JWT}&user=${ADMIN_ID}`,
			error: (err) => {
        		console.log(err);
    		}
		});
	}
	else {
		alert("New passwords do not match. Please try again.");
	}
});

//redirects to home page when logo is clicked
$('#logo').on('click', (event) => {
	event.preventDefault();
	window.location.href = `/`;
})