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

// LOAD DATA FROM JSON FILES //

	generatePlayer(plr) { // takes a JSON object
		this.PC = new Player(plr);
		console.log("generated player data from JSON as follows:");
		console.log(this.PC); 
	}

	generateLocations(loc) { // takes a JSON object
		console.log("generate locations entered");
		this.locs = loc;
	}

// TURN THE KEY FUNCTION //

	startLoop() {
		console.log("initializing game loop with setInterval at rate: " + this.rate);
		self = this;
		this.timer = setInterval(this.gLoop, this.rate);
		this.generateButtons();
		this.gLoop(); // one last lil push
	}

	setLoadMessage() {
		$("stimuli").html("<p>Loading secret data...</p>");
	}


// SCREEN UPDATE FUNCTIONS //

	displayCharSheet() {
		$("#charsheet").html("<h2>Char Sheet</h2>" +
		'<ul><li>' + self.PC.name + '</li>' +
		'<li>\"' + self.PC.motto + '\"</li>' +
		'<li>Health: ' + Math.floor(self.PC.health) + '</li>' +
		'<li>Focus: ' + self.PC.focus + '</li>' +
		'<li>Credit Level: ' + self.PC.creditlevel + '</li>' +
		'</ul>');		
	}

	updateStimuli() {
		let cur = self.PC.location;

		$("#stimuli").html("<p>" +			
			self.locs[cur].inittext +
			" </p>");
	}

	generateButtons() {
		$("#commands").html("<h2>Commands</h2>");
	}



///////////////////////
// PRIMARY GAME LOOP // (most important method)
///////////////////////

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

	changeLocation(newloc) {
		self.location = newloc;
		self.updateStimuli();
		self.generateButtons();
	}

}

// different useful methods //

let rollRandom = function(die, numdie) {
	let result = 0;
	for (var i = 0; i < numdie; i++) {
		result += Math.floor(Math.random() * die);

	}

	return result + 1;
}