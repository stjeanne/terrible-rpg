// initialization file for weird game

var PC = new Object;


PC = {
	name: "FAILURE",
	motto: "raw code",
	health: defaultStat,
	stamina: defaultStat,
	focus: defaultStat,
	will: defaultStat,
	strength: defaultStat,
	location: defaultLocation,
}; 


function startGame() {

	let GM = new Game(1000);

	var request;

	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else {
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}

	request.open('GET','player.json');
	request.onreadystatechange = function() {
		if ((request.status===200) && (request.readyState===4)) {
			PC = JSON.parse(request.responseText);
			console.log(PC);
		}

	}

	request.send();

	updateCharSheet();

	console.log(request);

	GM.startLoop();

//	displayCharSheet();	
} // startGame: initialize game data from json

var defaultStat = 10;
var defaultLocation = "home"; 