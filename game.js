// game.js: the primary game controller in all its hell glory, plus declarations for classes

class Game {
	constructor(rate) {
		this.version = GAME_VERSION;
		this.rate = rate;
		this.startTime = new Date();
		this.loop_count = 0;
		this.timer = null;
		this.PC = null;
		this.locs = null;
		this.items = null;
		this.monsters = null;
		this.gameLog = new Array;
		this.mode = "loading";
		this.numberLoans = 0;

		this.activeBattle = false;
		this.BM = new BattleManager;
		this.SM = new Store;
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

	generateItems(itm) {
		this.items = itm;
		console.log("generate items as follows:");
		console.log(this.items);
	}

	generateMonsters(mns) {
		this.monsters = mns;
		console.log("generate monsters as follows:");
		console.log(this.monsters);
	}

	generateStores(str) {
		this.stores = str;
		console.log("generate stores as follows:");
		console.log(this.stores);
	}

// TURN THE KEY FUNCTION //

	startLoop() {
		console.log("initializing game loop with setInterval at rate: " + this.rate);
		self = this;
		self.updateGUI();
		self.switchModes("normal");
		this.timer = setInterval(this.gLoop, this.rate);
		this.gLoop(); // one last lil push
	}

	resumeLoop() {
		console.log("initializing game loop for saved game at rate: " + this.rate);
		self = this;
		this.timer = 0;
		this.timer = setInterval(this.gLoop, this.rate);
		self.updateGUI();
		self.switchModes(GM.mode);
		playerMessage("Reloaded game from saved data.");
	}

	setLoadMessage(msg) {
		$("stimuli").html("<p>" + msg + "</p>");
	}


// SCREEN UPDATE FUNCTIONS //

	displayCharSheet() {

		let isbank = "";
		let yesdebt = "";

		if (self.PC.bank > 0) {
			isbank = "+";
		}

		if (self.PC.debt > 0) {
			yesdebt = "<li><span class=\"stat\">Debt</span> " + self.PC.debt + "</li>" +
						'<li><span class=\"stat\">Cr. LV</span> ' + self.PC.creditlevel + '</li>';
		}

		$("#charsheet").html('<ul><li><span class=\"stat\">Health</span> ' + Math.floor(self.PC.health) + '</li>' +
		'<li><span class=\"stat\">Focus</span> ' + self.PC.focus + '</li>' +
		'<li><span class=\"stat\">Cash</span> ' + self.PC.cash + isbank + '</li>' +
		yesdebt +
		'</ul>' +
//		

		"<ul><li><span class=\"stat\">TOOL</span> " + self.PC.gear.tool.disp + "</li>" + 
									"<li><span class=\"stat\">BODY</span> " + self.PC.gear.body.disp + "</li>" +
									"<li><span class=\"stat\">PHONES</span> " + self.PC.gear.music.disp + "</li>" + 
									"<li><span class=\"stat\">RING</span> " + self.PC.gear.ring.disp + "</li>" + 
									"</ul>");
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

		else if (self.mode == "equipchange") {
			$("#stimuli").html("<p>STR: " + self.PC.STR + " AGI: " + self.PC.AGI + " WIL: " + self.PC.WIL + " ABS: " + self.PC.ABS + "</p>");
			self.generateEquipList();
		}

		else if (self.mode == "buying") {
			self.SM.showStore();
		}

		else if (self.mode == "message") {					// this mode shows interrupt messages. also shows MC questions maybe?
			self.switchModes("normal");
			console.log("Tried to display a message but NO DICE yet");
		}

	}

	generateEquipList() { // this should be refined at some point to use the enumerated constant for slot names to avoid issues down the road
			let s_tool = "<h3>TOOLS</h3><ul class=equips><li><input type=\"radio\" name=\"newequip_tool\" value=\"nope\" checked/>No change</input></li>";
			let s_body = "<h3>BODY</h3><ul class=equips><li><input type=\"radio\" name=\"newequip_body\" value=\"nope\" checked/>No change</input></li>";
			let s_music = "<h3>HEADPHONES</h3><ul class=equips><li><input type=\"radio\" name=\"newequip_music\" value=\"nope\" checked/>No change</input></li>";
			let s_ring = "<h3>RINGS</h3><ul class=equips><li><input type=\"radio\" name=\"newequip_ring\" value=\"nope\" checked/>No change</input></li>";
			let s_pendant = "<h3>???</h3><ul class=equips><li><input type=\"radio\" name=\"newequip_pendant\" value=\"nope\" checked/>No change</input></li>";

			for (var i of self.PC.inventory) {

				let e = "";
				if (i.eq_list != undefined) { e = i.eq_list; }

				if (i.type == "tool") {
					s_tool += "<li><input type=\"radio\" name=\"newequip_tool\" value=\"" + i.name + "\">"  + i.disp + " " + e + "</input></li>";				
				}

				else if (i.type == "body") {
					s_body += "<li><input type=\"radio\" name=\"newequip_body\" value=\"" + i.name + "\">"  + i.disp + " " + e + "</input></li>";					
				}

				else if (i.type == "music") {
					s_music += "<li><input type=\"radio\" name=\"newequip_music\" value=\"" + i.name + "\">"  + i.disp + " " + e + "</input></li>";					
				}

				else if (i.type == "ring") {
					s_ring += "<li><input type=\"radio\" name=\"newequip_ring\" value=\"" + i.name + "\">"  + i.disp + " " + e + "</input></li>";					
				}

				else if (i.type == "pendant") {
					s_pendant += "<li><input type=\"radio\" name=\"newequip_pendant\" value=\"" + i.name + "\">"  + i.disp + " " + e + "</input></li>";					
				}


			}

			s_tool += "</ul>";
			s_body += "</ul>";
			s_music += "</ul>";
			s_ring += "</ul>";
			s_pendant += "</ul>";

			$("#stimuli").append(s_tool + s_body + s_music + s_ring + s_pendant + 
				"<input type=\"submit\" class=\"store_checkout\" value=\"Equip\">");
			$("input.store_checkout").on('click', self.equipNewItems);
	}

	equipNewItems() {

		for (let s in EQUIPSLOTS) {
			let ne = $("input[name='newequip_" + EQUIPSLOTS[s] + "']:checked").val();
			if (ne != undefined && ne != "nope") {
				console.log ("tried to equip " + ne);
				let sl = GM.getItemByName(ne).slot;

				self.PC.equipItem(ne, sl);
			}
		}

		playerMessage("Looking sharp!");
		self.displayCharSheet();
		self.switchModes("normal");
	}

	addCustomCommand(cmd, text) {
		$("#commands").append("<button id = \"" + cmd + "\">" + text + "</button>");
		$("#commands").append("\n<script>document.getElementById(\"" + cmd + "\").addEventListener(\"click\", " + cmd + ");\n</script>");
	}	

	generateButtons() {
		if (self.mode == "normal") {
			$("#commands").html("");

			let cur = self.PC.location;

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
			self.addCustomCommand("cmd_stopmeditate", "Stop meditating");
		}

		else if (self.mode == "equipchange") {
			$("#commands").html("");
			self.addCustomCommand("cmd_equipdone", "All done");
		}

		else if (self.mode == "crapfields") {
			$("#commands").html("");
			self.addCustomCommand("cmd_endbattle", "Stop working");
		}

		else if (self.mode == "buying") {
			$("#commands").html("");
			$("#commands").append("<button id = \"cmd_endshopping_button\">Stop shopping</button>");
			$("#commands").append("\n<script>document.getElementById(\"cmd_endshopping_button\").addEventListener(\"click\", cmd_endshopping);\n</script>");
		}

		else if (self.mode == "death") {
			$("#commands").html("");
			self.addCustomCommand("cmd_restartgame", "Try again?");
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

// battle management functions //

	initBattle() {
		self.activeBattle = true;
		self.BM.loadMonster(Math.floor(Math.random() * self.monsters.length));
		playerMessage("Started cleaning " + self.BM.monster.art + " " + self.BM.monster.disp + ".");
	}

	endBattle() {
		self.PC.bank += self.BM.monster.val;
		self.BM.clearMonster();
		self.activeBattle = false;
	}

// item management functions //

	getItemByName(itm) { // right now this just iterates through the items. there must be a better way but w/e!
		let r = GM.items.filter(function (i) {
			return i.name == itm;
		})

		return r[0]; // assumes one item matches only
	}

// debt management functions //

	compoundDebt() {
		self.PC.debt *= INTEREST_RATE;
		self.PC.debt = Math.ceil(self.PC.debt);
		playerMessage("Interest came due on your loan. Better be sure to pay it off at the bank...");
		console.log("compound interest called around " + self.loop_count + " ticks, new debt = " + self.PC.debt);
	}

// save/load functions //

	autoSave() {
		console.log("autosaving!");

		localStorage.setItem('testsave', JSON.stringify(self));
		localStorage.setItem('saveexists', true);
	}

	manualSave() {
		console.log("manual save!");

		localStorage.setItem('testsave', JSON.stringify(self));
		localStorage.setItem('saveexists', true);
	}


///////////////////////
// PRIMARY GAME LOOP // (most important method)
///////////////////////

	gLoop() { 

		if ((self.loop_count > AUTOSAVE_RATE) && !(self.loop_count % AUTOSAVE_RATE)) {
			if ((self.mode != "death") && (self.mode != "battle")) { // don't save if we die or are in a fight
				self.autoSave();
			}
		}

		if (!((self.loop_count - self.PC.loanstart) % COMPOUND_RATE)) {
			if (self.loop_count != self.PC.loanstart) { 
				if (self.debt > 0) {
					self.compoundDebt();
				}
			}
		}

		if (self.PC.focus > self.PC.max_focus) { self.PC.focus = self.PC.max_focus; }

		if (self.mode == "loading") {
			self.setLoadMessage("Loading game...");
		}

		else if ((self.mode == "death") || self.PC.health <= 0) {
			self.PC.health = 0;
			self.displayCharSheet();

			if (self.mode != "death") {
				self.switchModes("death");
			}
		}

		else if ((self.mode == "meditate")) {
			self.PC.meditateEnergy();
			self.updateGUI();
		}

		else if ((self.mode == "crapfields_false")) {
			self.PC.dummyBattle();
			self.updateGUI();
		}

		else if ((self.mode == "crapfields")) {

			if ((self.activeBattle == false) && !(self.loop_count % CRAPFIELDS_RATE)) {
				self.initBattle();
			}

			else if ((self.activeBattle == false) && (self.loop_count % CRAPFIELDS_RATE)) {
				playerMessage("Looking for trash to clean...");
			}

			else {
				self.BM.battleRound();
			}


			self.updateGUI();
		}

		else if (self.mode == "normal") {
			self.updateGUI();
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

	updateGUI(mode = 0) { // eventually change this based on whether we're above ground or in vision mazes
			self.displayCharSheet();
			self.updateStimuli();
			self.incrementClock();
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

let normalizeStat = function(n) {
	let r = 0;
	if (!isNaN(n)) {
		r = n;
	}

	return r;
}
