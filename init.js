// initialization file for weird game

// let GM = null;

function startGame() {

	console.log("LETS START A GAME");

	GM = new Game(1000);
	var request;
	var PC;

	$.getJSON('player.json', function(result) {
		GM.generatePlayer(result);
	});

//	GM.generatePlayer(PC);
	GM.startLoop();

} // startGame: initialize game data from json

var defaultStat = 10;
var defaultLocation = "home"; 