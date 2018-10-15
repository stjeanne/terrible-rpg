// commands for capitalism zero

var commandLog;

var cmd_idle = function() {
	console.log("clicked idle");
	commandLog = document.getElementById("statwindow");
//	var currentLog = commandLog.innerHTML;
	var currentLog = "";
	commandLog.innerHTML = currentLog + "<p>* Idling!</p>";
}

var cmd_clean = function() {
	console.log("clicked clean");
	commandLog.innerHTML = "<p>* You clean the area.</p>";
}
