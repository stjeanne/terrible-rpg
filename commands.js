// commands for capitalism zero



let playerMessage = function(msg) {

	GM.gameLog.push(msg); // add the new message to the end of the game log array. this will certainly lead to memory troubles one day

	let tempLog = new Array;

	if (GM.gameLog.length <= LOG_LENGTH) { tempLog = GM.gameLog; }
	else {
		tempLog = GM.gameLog.slice(GM.gameLog.length - LOG_LENGTH - 1, GM.gameLog.length); // weird bug at 13
	}

	clearPlayerLog();

	for (key of tempLog) {
		$("#statwindow").prepend("<p>" + CMD_PARSER + key);
	}
}

let clearPlayerLog = function() {
	$("#statwindow").text("");
}

// old test commands

let cmd_idle = function() {
	playerMessage("Idling.");
};

let cmd_clean = function() {
	GM.PC.giveCash(1);
	playerMessage("Cleaned the area. Yuck!");
};


let cmd_restartgame = function() {

	console.log("clicked restart button");

	clearInterval(GM.timer);
	GM.switchModes("loading");
	playerMessage("Trying again...better luck this time.");
	loadGameFromScratch();
};

// buying commands

let cmd_buygoods = function() { 
	GM.switchModes("buying");
	playerMessage("You began to shop.");
};

let cmd_endshopping = function() {
	GM.switchModes("normal");
	playerMessage("You stopped shopping.");
};

let cmd_storetalk = function() {
	GM.adHocBox(GM.SM.store.convo);
};

// banking commands

let cmd_applyforloan = function() {

	let loanQty = 0;

	if (GM.PC.debt > CREDITLEVELS[GM.PC.creditlevel - 1]) {
		playerMessage("The bank rejected your loan application.");
		GM.adHocBox("The holographic loan assistant looks at you sympathetically. \"I'd like to help, but how do we know you'd pay it back?\"");
	}

	else {

		loanQty = Math.floor(INIT_LOAN * Math.pow(DEBT_SCALE, GM.numberLoans));

		playerMessage("You applied for a loan of " + loanQty + ", and got it!");
		GM.PC.giveCash(loanQty);
		GM.PC.giveDebt(loanQty);
		GM.numberLoans++;

		if (GM.PC.loanstart == 0) { 
			GM.PC.loanstart = GM.loop_count; 
			console.log("player took on debt at " + GM.PC.loanstart);
		}

		GM.displayCharSheet();
		GM.adHocBox("The holographic loan assistant beams at you as your cash is loaded into your RAM. \"Congratulations! Remember to make payments regularly to prove you're honest, and to boost your credit.\"");
	}

};

let cmd_temppayloan = function() {

	let debt_10per = Math.floor(GM.PC.debt * .1);

	console.log("attempted to pay a debt.");

	if (GM.PC.debt <= 0) {
		playerMessage("You have no debts to pay. Walk free in this world!");
	}

	else if (GM.PC.cash >= GM.PC.debt) {
		playerMessage("You paid off all your debt! Wow, go you!");
		GM.PC.cash -= GM.PC.debt;
		GM.PC.giveCXP(GM.PC.debt);
		GM.PC.debt = 0;
	}

	else if (GM.PC.cash >= debt_10per) {
		playerMessage("You made an installment payment of 10 percent on your debt. Responsible!");
		GM.PC.cash -= debt_10per;
		GM.PC.debt -= debt_10per;
		GM.PC.giveCXP(debt_10per);
	}

	else if (GM.PC.cash > 0) {
		playerMessage("You gave the bank what you had toward your debt.");
		GM.PC.debt -= GM.PC.cash;
		GM.PC.cash = 0;
	}

	else {
		playerMessage("You don't have any money to pay off your debts. You feel terrible.");
		GM.PC.giveFocus(-1);
	}
}

// messaging commands //

let cmd_advanceconvo = function() {

};

let cmd_advancetext = function() {
	GM.switchModes(GM.prevmode);
};


// meditate commands //

let cmd_meditate = function() {
	GM.switchModes("meditate");
	GM.PC.energylevel = "normal";
	GM.meditateStart = GM.loop_count;
	GM.tranceDepth = 0;
	playerMessage("You enter a meditative state.");
};


let cmd_stopmeditate = function() {
	GM.resetMeditate();
	GM.switchModes("normal");

	GM.adHocBox("Blinking, you return to awareness of your body.");
	playerMessage("You stop meditating.");
};

let cmd_maxmeditate = function() {
	GM.resetMeditate();
	GM.switchModes("normal");
	GM.adHocBox("Your concentration starts to flicker. You may have reached the limit of your ability to meditate for now.");
	playerMessage("You stop meditating.");
};

let cmd_breakmeditate = function() {
	GM.resetMeditate();
	GM.switchModes("normal");
	GM.adHocBox("Your thoughts began to wander, and your meditation ends.");
	playerMessage("You lost concentration and stopped meditating.");
};

// equipment commands //

let cmd_equipchange = function() {
	GM.switchModes("equipchange");
	playerMessage("Began to look at all your cool equipment.");
};

let cmd_equipdone = function() {
	GM.switchModes("normal");
	playerMessage("Decided you were okay with the equipment you were already using.");
};

let cmd_decorate = function() {
	GM.switchModes("decorate");
	playerMessage("You begin to rearrange your meditation area.");
};

let cmd_enddecorate = function() {
	GM.switchModes("normal");
	playerMessage("Rearranged.");
};

let cmd_sleep = function() {

	if(GM.PC.energylevel == "tired") {
		GM.PC.focus = 1;
		playerMessage("Exhausted, you fall asleep easily...");
		GM.adHocBox(selectDream(), "oh no");
		GM.PC.energylevel = "rested";
	}

	else {
		GM.PC.focus = 1;
		playerMessage("You tried to sleep, but you aren't tired yet.");
		GM.adHocBox("You lie on the couch a long time, tossing and turning, but you can't make yourself fall asleep. Eventually, you get up. You'll sleep when you're tired.");
		GM.updateGUI();
	}

};


// battle entering //

let cmd_realcrapbattle = function() {
	GM.switchModes("crapfields");
};

let cmd_endbattle = function() {
	GM.switchModes("normal");
	playerMessage("You stop working...you feel sore.");
};

let cmd_ATM = function() {

	if (GM.PC.bank > 0) {
		playerMessage("Took all the cash from your bank account. You feel accomplished somehow.");
		GM.PC.giveCash(GM.PC.bank);
		GM.PC.bank = 0;
	}

	else {
		playerMessage("You don't have any money in your account.");
	}

	GM.displayCharSheet();
};


// LOCATION CHANGE FUNCTIONS. Eventually these may set specific game modes? //

let cmd_crapfields = function() {
	playerMessage("You have gone to the Crap Fields. :(");
	GM.changeLocation("crapfields");
};

let cmd_apartment = function() {
	playerMessage("You have returned home to your apartment.");
	GM.changeLocation("home");
};

let cmd_town = function() {
	playerMessage("You've gone to the city.");
	GM.changeLocation("town");
};

let cmd_hardware = function() {
	playerMessage("Entered the hardware store.");
	GM.changeLocation("hardware");
	GM.SM.loadStore(HARDWARE_ST);
};

let cmd_bodega = function() {
	playerMessage("Went to the bodega.");
	GM.changeLocation("bodega");
	GM.SM.loadStore(BODEGA_ST);
};

let cmd_occult = function() {
	playerMessage("Went to the local occult supply shop.");
	GM.changeLocation("occult");
	GM.SM.loadStore(OCCULT_ST);
};

let cmd_bank = function() {
	playerMessage("Went to the bank. Your account is: " + GM.PC.bank);
	GM.changeLocation("bank");
};

// vestigial functions, consider removing //

let cmd_fakebattle = function() {
	GM.switchModes("crapfields_false");
	playerMessage("You begin working...");
};


// virtual controls -- possibly move to a different file

let key_editorkey = function() {

		if (GM.mode == "editing") {
			console.log("whoa you pressed e to close the editor, debug mode is " + DEBUG_MODE);
			if (DEBUG_MODE) {	turnEditorOff() };
		}

		else {
			console.log("whoa you pressed e to open the editor (disabled for public release)");
			if (DEBUG_MODE) {	turnEditorOn(); }
		}
};

let key_debugkey = function() {
	DEBUG_MODE = !DEBUG_MODE;

	console.log("debug mode is now " + DEBUG_MODE);
};

let debugGiveLotsOfStuff = function() {
	if (DEBUG_MODE) {
		console.log("DEBUG: giving lots of free stuff");
		GM.PC.giveCash(99999);
		GM.PC.giveHealth(999);
	}
};