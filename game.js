// game.js: the primary game controller in all its hell glory, plus declarations for classes

class Game {
	constructor(rate) {
		this.rate = rate;
		this.startTime = new Date();
		this.loop_count = 0;
		this.timer = null;
		this.PC = null;
		this.locs = null;
		this.gameLog = new Array;
	}

	generatePlayer(plr) { // takes a JSON object
		this.PC = new Player(plr);
		console.log("generated player data from JSON as follows:");
		console.log(this.PC); 
	}

	generateLocations(loc) { // takes a JSON object
		console.log("generate locations entered");
		this.locs = loc;
	}

	startLoop() {
		console.log("initializing game loop with setInterval at rate: " + this.rate);
		self = this;
		this.timer = setInterval(this.gLoop, this.rate);
		this.gLoop(); // one last lil push
	}

	displayCharSheet() {
		$("#charsheet").html("<h2>Char Sheet</h2>" +
		'<ul><li>' + self.PC.name + '</li>' +
		'<li>\"' + self.PC.motto + '\"</li>' +
		'<li>Health: ' + Math.floor(self.PC.health) + '</li>' +
		'<li>Focus: ' + self.PC.focus + '</li>' +
		'<li>Location: ' + self.PC.location + '</l1>' + 
		'<li>Credit Level: ' + self.PC.creditlevel + '</li>' +
		'</ul>');		
	}

	updateStimuli() {
		

		$("#stimuli").html("<p>Testing that the loop works--this is dynamic location datas</p>");
	}

	gLoop() { 

		self.displayCharSheet();
		self.updateStimuli();
		
		$("#clock").html("<p>" + self.loop_count + "</p>");

		self.loop_count++;
	}

	totalTime() {
		console.log("note the time");
		return this.startTime + Date.now;
	}


}

let rollRandom = function(die, numdie) {
	let result = 0;
	for (var i = 0; i < numdie; i++) {
		result += Math.floor(Math.random() * die);

	}

//	console.log("final result: " + result);
	return result + 1;
}