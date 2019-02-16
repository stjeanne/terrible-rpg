// commands for capitalism zero

const CMD_PARSER = "* ";
const LOG_LENGTH = 10;


let playerMessage = function(msg) {

	GM.gameLog.push(msg); // add the new message to the end of the game log array. this will certainly lead to memory troubles one day

//	console.log ("current state of gameLog, which has length " + GM.gameLog.length + ": " + GM.gameLog);
	let tempLog = new Array;

	if (GM.gameLog.length <= LOG_LENGTH) { tempLog = GM.gameLog; }
	else {
		tempLog = GM.gameLog.slice(GM.gameLog.length - LOG_LENGTH - 1, GM.gameLog.length); // weird bug at 13
	}

//	console.log ("current state of tempLog, which has length " + tempLog.length + ": " + tempLog);

	$("#statwindow").text("");

	for (key of tempLog) {
		$("#statwindow").prepend("<p>" + CMD_PARSER + key);
	}

	GM.gLoop(); // make sure to update the screen, until we start to do it automatically

//	console.log("added message to statwindow: " + msg);
}

let cmd_idle = function() {
	playerMessage("Idling.");
};

let cmd_clean = function() {
	GM.PC.giveCash(1);
	playerMessage("Cleaned the area. Yuck!");
};

let cmd_meditate = function() {
	GM.PC.giveFocus(rollRandom(6,1) + 1);
	playerMessage("You meditate, gaining focus.");
};