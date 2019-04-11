// initialization file and settings for weird game



// let GM = null;

let doesSaveExist = function() {

	if (localStorage.getItem('saveexists')) {
		console.log("found old save data! :D");
		return true;
	}

	else {
		return false;
	}
};

let isVersionOkay = function() { // are we on or above the oldest supported version number? right now this always returns true + doesn't check against the game save

	return GAME_VERSION >= OLDEST_VERSION;

};

function loadGameFromScratch() {

		console.log("attempting to load a game from scratch");

		GM = null;

		GM = new Game(MASTER_RATE);

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
					$.getJSON('items.json', function(result) {
						console.log("items file : " + result);
						GM.generateItems(result);
					})
				})

				.done(function() {
					$.getJSON('stores.json', function(result) {
						console.log("stores file: " + result);
						GM.generateStores(result);
					})
				})

				.done(function() {
					$.getJSON('monsters.json', function(result) {
						console.log("monsters file: " + result);
						GM.generateMonsters(result);
					})
				})

				.done(function() {
					GM.startLoop();
				});

			});
}

function startGame() {

	let saveExists = doesSaveExist();
	let versionOkay = isVersionOkay();

	console.log("LETS START A GAME (on savesys branch)");

/*
	There should be three paths:
		- User has never seen this shit before. Current functionality: downloads all files from JSON.
		- User has seen this before and version matches. Constructs GM from existing game vars.
		- User has seen this before, but version does not match. Runs through a compatability check and reloads from new .json files where applicable.
*/

	if (saveExists && versionOkay) {

		console.log("loading GM from save. WILL IT WORK");

		loadGameFromScratch();

//		GM = new Game(MASTER_RATE);
//		let o = localStorage.getItem('testsave');

	}

	else if (saveExists) {
		// run version control functions, to be written
	}

	else if (!saveExists) {		// okay all clear, totally new player
		loadGameFromScratch();
	}
} // startGame: initialize game data from json

