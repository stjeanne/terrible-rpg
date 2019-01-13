// game.js: the primary game controller in all its hell glory, plus declarations for classes

class Game {
	constructor(rate) {
		this.rate = rate;
		this.startTime = new Date();
		this.loop_count = 0;
		this.timer = null;
		this.PC = null;
		this.gameLog = new Array;
	}

	generatePlayer(plr) { // takes a JSON object
		this.PC = new Player(plr);
		console.log("generated player data from JSON as follows:");
		console.log(this.PC); 
	}

	startLoop() {
		console.log("initializing game loop with setInterval at rate: " + this.rate);
		self = this;
		this.timer = setInterval(this.gLoop, this.rate);
		this.gLoop(); // one last lil push
	}

	gLoop() { // this is the main screen update loop, but for some reason it only works when we update manually on command input . . .
		$("#charsheet").html("<h2>Char Sheet</h2>" +
		'<ul><li>' + self.PC.name + '</li>' +
		'<li>\"' + self.PC.motto + '\"</li>' +
		'<li>Health: ' + Math.floor(self.PC.health) + '</li>' +
		'<li>Focus: ' + self.PC.focus + '</li>' +
		'<li>Location: ' + self.PC.location + '</l1>' + 
		'</ul>');

		self.loop_count++;
//		console.log("game loops: " + self.loop_count + " game rate: " + self.rate);
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