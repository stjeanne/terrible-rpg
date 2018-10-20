// game.js: the primary game controller in all its hell glory, plus declarations for classes

class Game {
	constructor(rate) {
		this.rate = rate;
		this.loop_count = 0;
		this.timerID = null;
	}

	gLoop() {
		$("#charsheet").html("<h2>Char Sheet</h2>" +
		'<ul><li>' + PC.name + '</li>' +
		'<li>\"' + PC.motto + '\"</li>' +
		'<li>Health: ' + PC.health + '</li>' +
		'<li>Focus: ' + PC.focus + '</li>' +
		'<li>Location: ' + PC.location + '</l1>' + 
		'</ul>');

//		updateCharSheet();

		this.loop_count++;
		console.log("game loops: " + this.loop_count + " game rate: " + this.rate);
	}

	startLoop() {
		this.timerID = setInterval(this.gLoop(), this.rate);
	}

}