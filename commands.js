// commands for capitalism zero



let playerMessage = function(msg) {

	GM.gameLog.push(msg); // add the new message to the end of the game log array. this will certainly lead to memory troubles one day

	let tempLog = new Array;

	if (GM.gameLog.length <= LOG_LENGTH) { tempLog = GM.gameLog; }
	else {
		tempLog = GM.gameLog.slice(GM.gameLog.length - LOG_LENGTH - 1, GM.gameLog.length); // weird bug at 13
	}

	$("#statwindow").text("");

	for (key of tempLog) {
		$("#statwindow").prepend("<p>" + CMD_PARSER + key);
	}
}

let clearPlayerLog = function() {
	GM.gamelog = [];
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

// banking commands

let cmd_applyforloan = function() {
//	GM.switchModes("question");

	let loanQty = Math.floor(INIT_LOAN * Math.pow(DEBT_SCALE, GM.numberLoans));

	playerMessage("You applied for a loan of " + loanQty + ", and got it!");
	GM.PC.giveCash(loanQty);
	GM.PC.giveDebt(loanQty);
	GM.numberLoans++;

	if (GM.PC.loanstart == 0) { 
		GM.PC.loanstart = GM.loop_count; 
		console.log("player took on debt at " + GM.PC.loanstart);
	}

	GM.displayCharSheet();
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
		GM.PC.debt = 0;
	}

	else if (GM.PC.cash >= debt_10per) {
		playerMessage("You made an installment payment of 10 percent on your debt. Responsible!");
		GM.PC.cash -= debt_10per;
		GM.PC.debt -= debt_10per;
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

let cmd_meditate = function() {
	GM.switchModes("meditate");
	playerMessage("You enter a meditative state.");
};

let cmd_equipchange = function() {
	GM.switchModes("equipchange");
	playerMessage("Began to look at all your cool equipment.");
};

let cmd_equipdone = function() {
	GM.switchModes("normal");
	playerMessage("Decided you were okay with the equipment you were already using.");
}

let cmd_sleep = function() {
	playerMessage("You go to sleep (though it doesn't do anything yet.)");
};

let cmd_stopmeditate = function() {
	GM.switchModes("normal");
	playerMessage("You stop meditating.");
};

let cmd_fakebattle = function() {
	GM.switchModes("crapfields_false");
	playerMessage("You begin working...");
};

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

let cmd_tempHeal = function() {
	if (GM.PC.cash >= PRICE_OF_EGGS) {
		GM.PC.giveCash(PRICE_OF_EGGS * -1);
		GM.PC.giveHealth(2);
		playerMessage("You bought food. It helps you feel a little better.");
	}

	else {
		playerMessage("No such thing as a free lunch. You feel kind of bad.");
		GM.PC.giveFocus(-1);
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