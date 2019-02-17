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
		this.mode = "loading";
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
		this.mode = "normal";
		this.timer = setInterval(this.gLoop, this.rate);
		this.generateButtons();
		this.gLoop(); // one last lil push
	}

	setLoadMessage(msg) {
		$("stimuli").html("<p>" + msg + "</p>");
	}


// SCREEN UPDATE FUNCTIONS //

	displayCharSheet() {
		$("#charsheet").html('<ul><li><span class=\"stat\">Health</span> ' + Math.floor(self.PC.health) + '</li>' +
		'<li><span class=\"stat\">Focus</span> ' + self.PC.focus + '</li>' +
		'<li><span class=\"stat\">Cash</span> ' + self.PC.cash + '</li>' +
		'<li><span class=\"stat\">Credit</span> ' + self.PC.creditlevel + '</li>' +
		'</ul>');		
	}

	updateStimuli() {
		let cur = self.PC.location;

		$("#stimuli").html("<p>" +			
			self.locs[cur].inittext +
			" </p>");
	}

	deathProcess() {
		$("#stimuli").html("<h2>YOU DIED</h2>" + 
			"<p>You had " + self.PC.bank + " in the bank, not yet gathering interest for hero investors.</p>");
		$("#commands").html("");
	}

	generateButtons() {
		$("#commands").html("");

		let cur = self.PC.location;

		console.log("testing commands for location cur = " + cur);

		for (var key of self.locs[cur].commands) {

			$("#commands").append("<button id = \"" + key.cmd + "_button\">" +
					key.disp +
				"</button>");

			$("#commands").append("\n<script>document.getElementById(\"" + key.cmd + "_button\").addEventListener(\"click\", " + key.cmd + ");\n</script>");

			console.log("iterating in command loop, value: " + key);
		}
	}



///////////////////////
// PRIMARY GAME LOOP // (most important method)
///////////////////////

	gLoop() { 

		if (self.mode == "loading") {
			self.setLoadMessage("Loading game...");
		}

		else if ((self.mode == "death") || self.PC.health <= 0) {
			self.mode == "death";
			self.PC.health = 0;
			self.deathProcess();
		}

		else if (self.mode == "normal") {
			self.displayCharSheet();
			self.updateStimuli();
			
			$("#clock").html("<p>" + self.loop_count + "</p>");

			self.loop_count++;
		}
	}

	totalTime() {
		console.log("note the time");
		return this.startTime + Date.now;
	}

	changeLocation(newloc) {
		self.PC.location = newloc;
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