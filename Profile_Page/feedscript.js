let settingsMenu = document.querySelector('.settings-menu');

function settingsMenuToggle(){
	settingsMenu.classList.toggle('settings-menu-height');
}

function userPosting() {
	let userInput = document.querySelector("#userInput");
	let userMessage = document.querySelector("#userMessage");

	userMessage.innerHTML = userInput.value;
}

let loadFile = function(event) {
	let image = document.getElementById('output');
	image.src=URL.createObjectURL(event.target.files[0]);
};