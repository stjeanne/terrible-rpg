// initialization file for weird game

// let GM = null;

function startGame() {

	console.log("LETS START A GAME");

	GM = new Game(1000);

	$.getJSON('player.json', function(result) {
		GM.generatePlayer(result);
	});

	$.getJSON('locations.json', function(result) { // i don't think this works yet
		console.log("locations file is: ");
		console.log(result);
		GM.generateLocations(result);
	});

	GM.startLoop();

} // startGame: initialize game data from json

var defaultStat = 10;
var defaultLocation = "home"; 