// commands for capitalism zero

const CMD_PARSER = "* ";

let playerMessage = function(msg) {

	$("#statwindow").prepend("<p>" + CMD_PARSER + msg);
	GM.gLoop();

	console.log("added message to statwindow: " + msg);
}

let cmd_idle = function() {
	playerMessage("Idling.");
	console.log("clicked idle");
};

let cmd_clean = function() {
	playerMessage("Cleaned the area. Yuck!");
	console.log("clicked clean");
};

let cmd_meditate = function() {
	playerMessage("You meditate, gaining focus.");
	GM.PC.giveFocus(rollRandom(4,1));
	console.log("clicked meditate");
//	$("#statwindow").prepend("<p>" + CMD_PARSER + "You meditate, gaining focus.</p>");

	GM.gLoop();

//	console.log("focus for " + PC.name + ": " + PC.focus);
};