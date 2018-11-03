// game.js: the primary game controller in all its hell glory, plus declarations for classes

class Game {
	constructor(rate) {
		this.rate = rate;
		this.startTime = new Date();
		this.loop_count = 0;
		this.timer = null;
		this.PC = new Player;
		this.gameLog = new Array;
	}

	generatePlayer(PC) { // takes a JSON object
		this.PC = new Player(PC);
		console.log("generated player data from JSON as follows:"); 
		console.log(this.PC);
	}

	startLoop() {
//		window.requestAnimationFrame(this.gLoop);
		console.log("initializing game loop with setInterval at rate: " + this.rate);
		this.timer = window.setInterval(this.gLoop(), this.rate);
	}

	gLoop() { // one day this will be the main screen update loop. right now it isn't!
		$("#charsheet").html("<h2>Char Sheet</h2>" +
		'<ul><li>' + this.PC.name + '</li>' +
		'<li>\"' + this.PC.motto + '\"</li>' +
		'<li>Health: ' + this.PC.health + '</li>' +
		'<li>Focus: ' + this.PC.focus + '</li>' +
		'<li>Location: ' + this.PC.location + '</l1>' + 
		'</ul>');

		this.loop_count++;
//		console.log("game loops: " + this.loop_count + " game rate: " + this.rate);
	}

	totalTime() {
		console.log("note the time");
		return startTime.now;
	}

}

let rollRandom = function(die, numdie) {
	let result = 0;
	for (var i = 0; i < numdie; i++) {
		result += Math.floor(Math.random() * die);

	}

	console.log("final result: " + result);
	return result + 1;
}