
var saveBtn = document.querySelector('#save');
var host = document.querySelector('#host');
var user = document.querySelector('#user');
var pass = document.querySelector('#password');

function onError(error){
	console.log(error);
}

function saveOptions() {

	/** Read data from input form */
	var optionsValues = {};
	optionsValues['host'] = host.value;
	optionsValues['user'] = user.value;
	optionsValues['password'] = password.value;

	/** Save options into local storage */
	browser.storage.local.set({ options : optionsValues });
  	e.preventDefault();
}

function loadOptions() {

	/** Read data from local storage */
	var gettingOptions = browser.storage.local.get('options');

	/** Fill the form with the data */
	gettingOptions.then(data => {
		host.value = data.options['host'];
		user.value = data.options['user'];
		password.value = data.options['password'];
	}, onError);
}

document.addEventListener('DOMContentLoaded', loadOptions);
saveBtn.addEventListener("click", saveOptions);

