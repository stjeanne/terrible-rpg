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
		this.prevmode = null;
		this.numberLoans = 0;

		this.activeBattle = false;
		this.BM = new BattleManager;
		this.SM = new Store;
		this.PV = null;					// will hold the PsychicVoyage manager


		this.meditateStart = 0;
		this.tranceDepth = 0;
		this.plotFlags = new Array;

		this.allLevels = new Array;

		this.testingFromEditor = false;

		this.commandStack = new Array;
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

	addLevel(levelFileName) {		// takes a string filename and uses it as an input to LoadLevel. Pushes the result to the array of levels in the game manager.

		console.log("trying to add the level from file " + MAPS_PATH + levelFileName);

		self = this;

		$.getJSON(MAPS_PATH + levelFileName, function(result) {

//				console.log("here's what we got from addLevel: ");
//				console.log(result);
				let l = new Level(result);
//				console.log("here's the value of l: ");
//				console.log(l);
				self.allLevels.push(l);
			})
	}







////////////////////////
// ACCESSOR FUNCTIONS //
////////////////////////

	getLevel(levelFileName) {

		console.log("requested the level with filename " + levelFileName);

		return this.allLevels.filter(i => i.filename == levelFileName);
	}

	isThisAnEditorTest() { return this.testingFromEditor; }

	setTestingFlag() { this.testingFromEditor = true; }

	unsetTestingFlag() { this.testingFromEditor = false; }


	enqueueCommand(c) {
		console.log("requested to add " + c + " to GM's command stack");
		this.commandStack.enqueue(c);
	}

	dequeueCommand() {

		let d = this.commandStack.dequeue();
		console.log("requested to remove " + d + " from GM's command stack");
		return d;
	}




///////////////////////////
// TURN THE KEY FUNCTION //

	startLoop() {
		console.log("initializing game loop with setInterval at rate: " + this.rate);
		self = this;
		self.updateGUI();
		self.switchModes("normal");
		playerMessage("Welcome to CAPITALISM ZERO WORLD.");
		this.timer = setInterval(this.gLoop, this.rate);
		self.updateGUI();
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




///////////////////////
// CONTROL FUNCTIONS //



	wireUpControls() {
		console.log("wiring up new controls for mode " + self.mode);

		// first unbind old control

		$(window).off('keydown');

		if (self.mode == "voyaging") {

			$(window).keydown(k => {

				switch(k.key) {
					case MAZE_FORWARD: console.log("walked forward in a psychic voyage.");
					break;

					case MAZE_LEFT: console.log("turned left in a psychic voyage.");
						self.PC.turnLeft();
					break;

					case MAZE_RIGHT: console.log("turned right in a psychic voyage.");
						self.PC.turnRight();
					break;

					case MAZE_BACK: console.log("stepped backward in a psychic voyage.");
					break;

					case 'q': console.log("strafed left in a psychic voyage."); 
					break;

					case 'e': console.log("strafed right in a psychic voyage.");
					break;

					case " ": console.log("pressed spacebar in a psychic voyage.");
					break;

					case "Escape": 
						console.log("pressed escape in a psychic voyage.");
//						self.enqueueCommand("PV_escape");
						self.PV.emergencyExit();
						break;
				}

			})

		}

		else { 

			$(window).keydown(k => {

//					console.log("pressed key: ");
//					console.log(k);

				if (k.key == '`') { key_debugkey(); }
				else if (k.key == 'e') { key_editorkey(); }
				else if (k.key == '1') { debugGiveLotsOfStuff(); }
			});

				// if we ever need it for some reason, a keyup listener could also go here to give us some logic around whether we're holding down keys?

		}
	}




/////////////////////////////
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
		'<li><span class=\"stat\">Energy</span> ' + self.PC.energylevel + '</li>' + 
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

		else if (self.mode == "message") {
			// does this need to do anything?
		}

		else if (self.mode == "decorate") {
			$("#stimuli").html("<p>What elements should go where?</p>");
			self.generateDecorList();
		}

		else if (self.mode == "meditate") {					// eventually this should be replaced by a lookup routine through a hypothetical meditate.json
			$("#stimuli").html("<p>Meditating...</p>");

			self.processMeditationState();
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

		else if (self.mode == "editing") {
			$("#stimuli").html("<p>Editing the map! Press E again to stop.</p>");
			console.log("Changing game mode to editing.");
		}

		else if (self.mode == "voyaging") {
			console.log("going into the psychic voyage mode.");
		}
	}

	generateDecorList() {

		// filter inventory list for only statue items
		// generate radio buttons for each
		// generate a "none" button

		// filter inventory list for only incense items
		// generate radio buttons for each
		// generate a none button

		// generate a "change" button

		$('#stimuli').append("<li><input type=\"radio\">You can't think of anything to do yet</input></li>");
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

		else if (self.mode == "message") {
			// should handle this via messaging system itself. if it's a choice point, will add the appropriate commands.
		}

		else if (self.mode == "meditate") {
			$("#commands").html("");
			self.addCustomCommand("cmd_stopmeditate", "Stop meditating");
		}

		else if (self.mode == "decorate") {
			$("#commands").html("");
			self.addCustomCommand("cmd_enddecorate", "Looks good as it is");
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

		else if (self.mode == "editing") {
			$("#commands").html("");
			//pause game logic
		}

		else if (self.mode == "voyaging") {
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
		self.wireUpControls();
	}








///////////////////
// PSYCHIC VOYAGE //

	beginAPsychicVoyage(level) {

		self.switchModes("voyaging");

		this.PV = new PsychicVoyage(level);
		this.PV.beginVoyage();

	}









/////////////////////////////////
// battle management functions //

	initBattle() {
		self.activeBattle = true;
		self.BM.loadMonster(Math.floor(Math.random() * self.monsters.length));
		playerMessage("Started cleaning " + self.BM.monster.art + " " + self.BM.monster.disp + ".");
	}

	endBattle() {
		self.PC.bank += self.BM.monster.val;
		self.BM.clearMonster();

		if (self.PC.energylevel != "tired") {
			self.PC.energylevel = "tired";
			playerMessage("You're exhausted--you could fall asleep any minute. But you should wait until you get home.");
		}
		self.activeBattle = false;
	}




////////////////////////
// text box functions //

	textBox(text) {		// takes a conversation lookup key

	}

	adHocBox(text, clrmsg = "Okay") {
		self.prevmode = self.mode;				// permits us to drop in messages in the middle of any mode
		self.switchModes("message");

		$("#stimuli").html("");
		$("#stimuli").append("<p>" + text + "</p>");

		$("#commands").html("");
		self.addCustomCommand("cmd_advancetext", clrmsg);	
	}





///////////////////////////////
// item management functions //

	getItemByName(itm) { // right now this just iterates through the items. there must be a better way but w/e!
		let r = GM.items.filter(function (i) {
			return i.name == itm;
		})

		return r[0]; // assumes one item matches only
	}




///////////////////////////////
// debt management functions //

	compoundDebt() {
		self.PC.debt *= INTEREST_RATE;
		self.PC.debt = Math.ceil(self.PC.debt);
		playerMessage("Interest came due on your loan. Better be sure to pay it off at the bank...");
		console.log("compound interest called around " + self.loop_count + " ticks, new debt = " + self.PC.debt);
	}







//////////////////////////
// meditation functions //

	processMeditationState() {
		console.log("process meditation state: current trance depth is " + self.tranceDepth);

		if(MEDITATION_IS_LIVE) {
			let i = MEDITATION_DEPTH - (MEDITATION_DEPTH - MEDITATE_GRACE_PERIOD);	// should be 3 with init constants

			if (self.tranceDepth > MEDITATION_DEPTH) {
				cmd_maxmeditate();
			}

			else if (!(self.tranceDepth % MEDITATE_RATE) && (self.tranceDepth > i) && (self.tranceDepth <= MEDITATION_DEPTH)) {
				loadOverworldColors(1 - (self.tranceDepth / MEDITATION_DEPTH));
			}
		}
	}

	resetMeditate() {
		self.tranceDepth = 0;
		self.turnOffFragileMeditate();
		loadOverworldColors();
	}

	turnOnFragileMeditate() {
		// adds an event listener to body: if the mouse moves, meditation breaks.
	}

	turnOffFragileMeditate() {
		// removes the event listener for fragile meditation.
	}










// save/load functions //

	autoSave() {

		console.log("autosave disabled sorry");
//		console.log("autosaving!");

//		localStorage.setItem('testsave', JSON.stringify(self));
//		localStorage.setItem('saveexists', true);
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
			if ((self.mode != "death") && (self.mode != "crapfields")) { // don't save if we die or are in a fight
				self.autoSave();
			}
		}

		if (!((self.loop_count - self.PC.loanstart) % COMPOUND_RATE)) {

			if ((self.loop_count > self.PC.loanstart) && (self.PC.debt > 0)) { 
					self.compoundDebt();
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

		else if (self.mode == "decorate") {
			self.updateGUI();
		}

		else if ((self.mode == "meditate")) {
			if(GM.loop_count >= (GM.meditateStart + MEDITATE_GRACE_PERIOD)) {
				self.turnOnFragileMeditate();
			}

			self.PC.meditateEnergy();
			self.tranceDepth++;
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

let randomRange = function(min, max) {
	return Math.floor((Math.random() * (max - min)) + min);
}

let normalizeStat = function(n) {
	let r = 0;
	if (!isNaN(n)) {
		r = n;
	}

	return r;
}
