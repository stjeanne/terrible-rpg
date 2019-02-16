// initialization file for weird game

// let GM = null;

function startGame() {

	console.log("LETS START A GAME");

	GM = new Game(1000);
	GM.setLoadMessage();

	$.getJSON('player.json', function(result) {
		GM.generatePlayer(result);
	})

		.done(function() {
			$.getJSON('locations.json', function(result) { 
				console.log("locations file is: ");
				console.log(result);
				GM.generateLocations(result);
		})

			.done(function() {
				GM.startLoop();
			});
		});


//	while ((GM.PC == null) && (GM.locs == null)) {
//		$("stimuli").html("<p>Loading resources...</p>");
//	}

//	GM.startLoop();

} // startGame: initialize game data from json

const defaultStat = 10;
const defaultLocation = "home"; 