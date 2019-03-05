// initialization file and settings for weird game



// let GM = null;

function startGame() {

	console.log("LETS START A GAME");

	GM = new Game(1000);

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

} // startGame: initialize game data from json

const defaultStat = 10;
const defaultLocation = "home"; 