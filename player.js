// player class definition and accessor functions. Must come before game.js.


class Player {

	constructor() {
		this.name = "Bland";
		this.focus = 0;
		this.motto = "the JSON isn't loading";
		this.health = 3;
		this.location = "limbo";
	}

/*	constructor(PC_obj) {
		let RNA = PC_obj;
		if (RNA['name']) { this.name = RNA.name; }
	}*/


	giveFocus(amt) {
		console.log("giving " + amt + " focus via giveFocus");
		this.focus += amt;
	}
}