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
		self.switchModes("normal");
		this.timer = setInterval(this.gLoop, this.rate);
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

		if (self.mode == "normal") {
			let cur = self.PC.location;

			$("#stimuli").html("<p>" +			
				self.locs[cur].inittext +
				" </p>");			
		}

		else if (self.mode == "meditate") {					// eventually this should be replaced by a lookup routine through a hypothetical meditate.json
			$("#stimuli").html("<p>Meditating...</p>");
		}

		else if (self.mode == "death") {
			$("#stimuli").html("<h2>YOU DIED</h2>" + 
				"<p>You had " + self.PC.bank + " in the bank, not yet gathering interest for hero investors.</p>");			
		}

	}

	generateButtons() {
		if (self.mode == "normal") {
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

		else if (self.mode == "meditate") {
			$("#commands").html("");
			$("#commands").append("<button id = \"cmd_stopmeditate_button\">Stop meditating</button>");
			$("#commands").append("\n<script>document.getElementById(\"cmd_stopmeditate_button\").addEventListener(\"click\", cmd_stopmeditate);\n</script>");
//			console.log("added stop meditate command will it work");
		}

		else if (self.mode == "crapfields") {
			$("#commands").html("");
			$("#commands").append("<button id = \"cmd_endbattle_button\">Stop working</button>");
			$("#commands").append("\n<script>document.getElementById(\"cmd_endbattle_button\").addEventListener(\"click\", cmd_endbattle);\n</script>");
//			console.log("added end battle command will it work");
		}

		else if (self.mode == "death") {
			$("#commands").html("");
		}
	}

	incrementClock (x = undefined) {
			$("#clock").html("<p>" + self.loop_count + "</p>");

			if (x) {
				self.loop_count += x;
			}

			else {
				self.loop_count++;
			}
	}

	switchModes(newmode) {
		self.mode = newmode;
		self.updateStimuli();
		self.generateButtons();
	}


///////////////////////
// PRIMARY GAME LOOP // (most important method)
///////////////////////

	gLoop() { 

		if (self.mode == "loading") {
			self.setLoadMessage("Loading game...");
		}

		else if ((self.mode == "death") || self.PC.health <= 0) {
			self.PC.health = 0;
			self.switchModes("death");
		}

		else if ((self.mode == "meditate")) {
			self.PC.meditateEnergy();
			self.displayCharSheet();
			self.updateStimuli();
			self.incrementClock();
		}

		else if ((self.mode == "crapfields")) {
			self.PC.dummyBattle();
			self.displayCharSheet();
			self.updateStimuli();
			self.incrementClock();			
		}

		else if (self.mode == "normal") {
			self.displayCharSheet();
			self.updateStimuli();
			self.incrementClock();
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