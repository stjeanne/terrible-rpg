// player class definition and accessor functions. Must come before game.js.


class Player {

	constructor() {
		this.name = "Bland";
		this.focus = 0;
		this.motto = "the JSON isn't loading";
		this.health = 3;
		this.location = "limbo";
		this.cash = 0;
	}

/*	constructor(PC_obj) {
		let RNA = PC_obj;
		if (RNA['name']) { this.name = RNA.name; }
	}*/


	giveFocus(amt) {
		console.log("giving " + amt + " focus via giveFocus");
		this.focus += amt;
	}

	giveHealth(amt) {
		console.log("giveHealth: " + amt);
		this.health += amt;
	}

	giveCash(amt) {
		console.log("giveCash: " + amt);
		this.cash += amt;
	}
}