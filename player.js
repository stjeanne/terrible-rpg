// player class definition and accessor functions. Must come before game.js.


class Player {

	constructor(plr) {
		console.log ("testing what was passed to player constructor, which is:");
		console.log(plr);

		this.name = plr.name;
		this.motto = plr.motto;
		this.health = plr.health;
		this.focus = plr.focus;
		this.max_focus = plr.max_focus;
		this.focus_rate = plr.focus_rate;

		this.stamina = plr.stamina;
		this.STR = plr.STR;
		this.WIL = plr.WIL;
		this.ABS = plr.ABS;	// absorb
		this.AGI = plr.AGI;

		this.location = plr.location;
		this.cash = plr.cash;
		this.bank = plr.bank;
		this.creditlevel = plr.creditlevel;
		this.credit_max = plr.credit_max;
		this.debt = plr.debt;
		this.gear = {
			tool: "none",		// damage dealer
			body: "none",		// protect from damage (absorb) or psychic damage (dodge)
			music: "none",		// increase speed (dodge), decrease focus faster
			pendant: "none", 	// protect from psychic damage (absorb)
			statue: "none", 	// change effects of sigils, change dream effects
			ring: "none" 		// increase focus, focus rate
		};
		this.inventory = []		// push items to it
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

/**************************************

INVENTORY MANAGEMENT

***************************************/

	addInventory(item) {

		let i = "";

		if (typeof item == "string") {
			i = GM.getItemByName(item);
		}

		else {
			i = item;
		}

		console.log("added " + i.disp + " to player inventory.");

		this.inventory.push(i);

		if(i.type == "food") { // this must change, right now all food gets used immediately
			effect_food(i);
		}
	}

	removeInventory(item) {

		// this will need to be built

		console.log("theoretically removed " + item + " from player inventory.");
	}

	equipItem(slot, item) {
	
		this.removeInventory(item);

		if (this.gear[slot] == "none") {
			this.gear[slot] = GM.getItemByName(item);
		}

		else {
			this.unequipItem(slot);
			this.gear[slot] = GM.getItemByName(item);
		}

		// right now stat giving is busted--ultimately should check that you have the correct properties
/*
		this.STR += normalizeStat(this.gear[slot].STR);
		this.AGI += normalizeStat(this.gear[slot].AGI);
		this.WIL += normalizeStat(this.gear[slot].WIL);
		this.max_focus += normalizeStat(this.gear[slot].max_focus);
*/
		console.log("equipped " + this.gear[slot].name + " in equipment slot: " + slot);

	}

	unequipItem(slot) {	// pass in the actual inventory slot
		console.log("unequipItem slot = " + slot);


		if (this.gear[slot] != "none") {
			this.addInventory(GM.getItemByName(this.gear[slot].name));

			this.STR -= normalizeStat(this.gear[slot].STR);
			this.AGI -= normalizeStat(this.gear[slot].AGI);
			this.WIL -= normalizeStat(this.gear[slot].WIL);
			this.max_focus -= normalizeStat(this.gear[slot].max_focus);

			this.gear[slot] = "none";
		}
	}

	physAtk() {
		return rollRandom(3,1) + Math.floor(0.5 * this.STR);
	}

	meditateEnergy() {
		if (!(GM.loop_count % MEDITATE_RATE)) {
			this.giveFocus(rollRandom(3,1) + 1);
		}

		if (this.focus >= this.max_focus) {
			this.focus = this.max_focus;

			playerMessage("Your mind is beginning to wander... you stop meditating.");
			GM.switchModes("normal");
		}
	}


}