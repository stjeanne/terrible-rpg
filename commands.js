// commands for capitalism zero

const CMD_PARSER = "* ";

let cmd_idle = function() {
	$("#statwindow").prepend("<p>" + CMD_PARSER + "Idling.</p>");
	GM.gLoop();

	console.log("clicked idle");
//	var commandLog = document.getElementById("statwindow");
//	commandLog.innerHTML = "<p>* Idling!</p>";
};

let cmd_clean = function() {
	$("#statwindow").html("<p>" + CMD_PARSER + "You clean the area.</p>");
	GM.gLoop();

	console.log("clicked clean");
};

let cmd_meditate = function() {
	console.log("clicked meditate");
	$("#statwindow").prepend("<p>" + CMD_PARSER + "You meditate, gaining focus.</p>");

	PC.focus += Math.floor((Math.random() * 4) + 8);
	GM.gLoop();

	console.log("focus for " + PC.name + ": " + PC.focus);
};