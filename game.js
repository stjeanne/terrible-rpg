// game.js: the primary game controller in all its hell glory, plus declarations for classes

class Game {
	constructor(rate) {
		this.rate = rate;
		this.loop_count = 0;
		this.timerID = null;
		this.PC = new Player;
		this.gameLog = new Array;
	}

	generatePlayer(PC) { // takes a JSON object
		this.PC = new Player(PC);
		console.log("generated player data from JSON as follows:"); 
		console.log(this.PC);
	}

	startLoop() {
		this.timerID = setInterval(this.gLoop(), this.rate);
		this.gLoop();
	}

	gLoop() {
		$("#charsheet").html("<h2>Char Sheet</h2>" +
		'<ul><li>' + this.PC.name + '</li>' +
		'<li>\"' + this.PC.motto + '\"</li>' +
		'<li>Health: ' + this.PC.health + '</li>' +
		'<li>Focus: ' + this.PC.focus + '</li>' +
		'<li>Location: ' + this.PC.location + '</l1>' + 
		'</ul>');

		this.loop_count++;
		console.log("game loops: " + this.loop_count + " game rate: " + this.rate);
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