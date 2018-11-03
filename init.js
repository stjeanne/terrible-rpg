// initialization file for weird game

var GM = null;
//var PC = null;

/*{
	name: "FAILURE",
	motto: "raw code",
	health: defaultStat,
	stamina: defaultStat,
	focus: defaultStat,
	will: defaultStat,
	strength: defaultStat,
	location: defaultLocation,
}*/ 


function startGame() {

	console.log("LETS START A GAME");

	GM = new Game(1000);
	var request;
	var PC;

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

//	updateCharSheet();

	console.log(request);
	GM.generatePlayer(PC);
	GM.startLoop();

//	displayCharSheet();	
} // startGame: initialize game data from json

var defaultStat = 10;
var defaultLocation = "home"; 