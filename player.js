// player class definition and accessor functions. Must come before game.js.


class Player {

	constructor(plr) {
		console.log ("testing what was passed to player constructor, which is:");
		console.log(plr);

		this.name = plr.name;
		this.motto = plr.motto;
		this.health = plr.health;
		this.focus = plr.focus;
		this.stamina = plr.stamina;
		this.strength = plr.strength;
		this.will = plr.will;
		this.location = plr.location;
		this.cash = plr.cash;
		this.bank = plr.bank;
		this.creditlevel = plr.creditlevel;
		this.credit_max = plr.credit_max;
		this.debt = plr.debt;
	}

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

	giveBank(amt) {
		console.log("bank account up by " + amt);
		this.bank += amt;
	}

	meditateEnergy() {
		if (!(GM.loop_count % MEDITATE_RATE)) {
			this.giveFocus(rollRandom(6,1) + 1);
		}
	}
}