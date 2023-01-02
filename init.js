// initialization file and settings for weird game

let currentlyLoading = false;

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

let createMasterControls = function() { //eventually this will have both saving, loading from save file, and restarting. 

	$('#header').append("<button id=\"master_reload\">Start New Game</button>");
	$('#header').append("\n<script>document.getElementById(\"master_reload\").addEventListener(\"click\", reloadButton);</script>")

	// secretly we add the map editor functionality here, for now. probably makes sense to refine this a lot later

	$(window).keypress(function (k) {
		let keycode = k.key;
		
		if (keycode == 'e') {
			key_editorkey();
		}

		else if (keycode == '`') {
			key_debugkey();
		}

		else if (keycode == '1') {
			debugGiveLotsOfStuff();
		}
	})
};

function loadGameFromScratch() {

		console.log("attempting to load a game from scratch");


		GM = new Game(MASTER_RATE);
		clearPlayerLog();
		loadGameData(true);
}

function reloadButton() {

	clearInterval(GM.timer);
	clearPlayerLog();
	playerMessage("Starting new game!");
	loadGameFromScratch();
}

function loadGameData(isThisANewGame) {

		currentlyLoading = true;

		loadOverworldColors();

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
					WORKING_LEVELS.forEach(l => GM.addLevel(l));	
				})

				.done(function() {
					if(isThisANewGame) {
						GM.startLoop();
						currentlyLoading = false;
					}

					else {
						currentlyLoading = false;
					}
				});
			});


}

function parseColor(r, intense = 1) {	
	return "rgb(" + (r[0] * intense) + "," + (r[1] * intense) + "," + (r[2] * intense) + ")";
}


function loadOverworldColors(i = 1) {
	$('body').css("background-color", parseColor(CSS_BUTTONTEXT, i));
	$('#wrapper').css("color", parseColor(CSS_TEXT, i));
	$('#wrapper').css("background-color", parseColor(CSS_BUTTONTEXT, i));
	$('#rightcol').css("background-color", parseColor(CSS_STIMBASE, i));

	$('#commands button').css("color", parseColor(CSS_TEXT, i));
	$('#commands button').css("background-color", parseColor(CSS_BUTTONBASE, i));
	$('#commands button:hover').css("background-color", parseColor(CSS_BUTTONHOVER, i));

	$('#charsheet .stat').css("color", parseColor(CSS_BUTTONBASE, i));

	$('#header button').css("color", parseColor(CSS_TEXT, i));
	$('#header button').css("background-color", parseColor(CSS_BUTTONBASE, i));
	$('#header button:hover').css("background-color", parseColor(CSS_BUTTONHOVER, i));
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

		GM = new Game(MASTER_RATE);
		let o = JSON.parse(localStorage.getItem('testsave'));
		let s = o.SM;
		let b = o.BM;
		let p = o.PC;

		console.log("saved player data is : " + p);

		currentlyLoading = true;

		loadGameData(false);

//		while(currentlyLoading) {
//			console.log("still loading data");
			// idle
//		}

		GM = Object.assign(GM,o);

		GM.SM = new Store;
		Object.assign(GM.SM, s);

		GM.BM = new BattleManager;
		Object.assign(GM.BM, b);

		Object.assign(GM.PC, p);


		self = GM;
		GM.resumeLoop();
	}

	else if (saveExists) {
		// run version control functions, to be written as required
	}

	else if (!saveExists) {		// okay all clear, totally new player
		loadGameFromScratch();
	}
} 

