// commands for capitalism zero


var cmd_idle = function() {
	console.log("clicked idle");
	var commandLog = document.getElementById("statwindow");
	commandLog.innerHTML = "<p>* Idling!</p>";
};

var cmd_clean = function() {
	console.log("clicked clean");
	var commandLog = document.getElementById("statwindow");
	commandLog.innerHTML = "<p>* You clean the area.</p>";
};

var cmd_meditate = function() {
	console.log("clicked meditate");
	var commandLog = document.getElementById("statwindow");
	commandLog.innerHTML = "<p>* Meditated; gained focus.</p>";
	PC.focus += 10;
};