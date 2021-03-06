// player class definition and accessor functions. Must come before game.js.


class Player {

	constructor(plr) {
		console.log ("testing what was passed to player constructor, which is:");
		console.log(plr);

		if(plr == undefined) {
			console.log("going to the don't worry about it version of the constructor");

			this.name = null;
			this.motto = null;
			this.health = 99;
			this.focus = null;
			this.max_focus = null;
			this.focus_rate = null;

			this.stamina = null;
			this.STR = null;
			this.WIL = null;
			this.ABS = null;	// absorb
			this.AGI = null;

			this.energylevel = null;

			this.location = null;
			this.cash = null;
			this.bank = null;
			this.creditlevel = null;
			this.credit_max = null;
			this.cxp = 0;
			this.debt = null;
			this.loanstart = 0;
			this.gear = {
				tool: "none",		// damage dealer
				body: "none",		// protect from damage (absorb) or psychic damage (dodge)
				music: "none",		// increase speed (dodge), decrease focus faster
				pendant: "none", 	// protect from psychic damage (absorb)
				statue: "none", 	// change effects of sigils, change dream effects
				ring: "none" 		// increase focus, focus rate
			};
			this.inventory = []		// push items to it. could be an issue with passing by ref rather than value.
		}

		else {

			console.log("constructing from passed JSON object");

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

			this.energylevel = plr.energylevel;

			this.location = plr.location;
			this.cash = plr.cash;
			this.bank = plr.bank;
			this.creditlevel = plr.creditlevel;
			this.credit_max = plr.credit_max;
			this.cxp = plr.cxp;
			this.debt = plr.debt;
			this.loanstart = 0;
			this.gear = {
				tool: "none",		// damage dealer
				body: "none",		// protect from damage (absorb) or psychic damage (dodge)
				music: "none",		// increase speed (dodge), decrease focus faster
				pendant: "none", 	// protect from psychic damage (absorb)
				statue: "none", 	// change effects of sigils, change dream effects
				ring: "none" 		// increase focus, focus rate
			};
			this.inventory = []		// push items to it. could be an issue with passing by ref rather than value.
		}

		this.tired = false;
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

	giveDebt(amt) {
		console.log("took on a new debt oh no: " + amt);
		this.debt += amt;
	}

	giveCXP(amt) {
		console.log("gained CXP: " + amt);
		this.cxp += amt;
		let s = this;

		if (this.cxp >= CXP_NEEDED[this.creditlevel]) {
			s.CLevelUp();
		}
	}

	CLevelUp() {
		console.log("gained a credit level!");
		this.creditlevel++;
		GM.updateGUI();
		GM.adHocBox("Congratulations! Through responsible and regular payment, your credit level has gone up!");
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

		if(i.type == "food") { // this must change, right now all food gets used immediately
			this.useItem(i);
		}

		else {
			console.log("added " + i.disp + " to player inventory.");
			this.inventory.push(i);
		}
	}

	removeInventory(item) {

		// this will need to be built

		console.log("theoretically removed " + item + " from player inventory.");
	}

	useItem(item) {

		let i = "";

		if (typeof item == "string") {
			i = GM.getItemByName(item);
		}

		else {
			i = item;
		}

		effect_food(i);
	}

	equipItem(item, slot) {

		if (slot == undefined) {
			slot = GM.getItemByName(item).type;
		}
	
		this.removeInventory(item);

		if (this.gear[slot] == "none") {
			this.gear[slot] = GM.getItemByName(item);
		}

		else {
			this.unequipItem(slot);
			this.gear[slot] = GM.getItemByName(item);
		}

		this.STR += normalizeStat(this.gear[slot].STR);
		this.AGI += normalizeStat(this.gear[slot].AGI);
		this.WIL += normalizeStat(this.gear[slot].WIL);
		this.ABS += normalizeStat(this.gear[slot].ABS);
		this.max_focus += normalizeStat(this.gear[slot].max_focus);

		console.log("equipped " + this.gear[slot].name + " in equipment slot: " + slot);

	}

	unequipItem(slot) {	// pass in the actual inventory slot
		console.log("unequipItem slot = " + slot);


		if (this.gear[slot] != "none") {
			this.addInventory(GM.getItemByName(this.gear[slot].name));

			this.STR -= normalizeStat(this.gear[slot].STR);
			this.AGI -= normalizeStat(this.gear[slot].AGI);
			this.WIL -= normalizeStat(this.gear[slot].WIL);
			this.ABS -= normalizeStat(this.gear[slot].ABS);
			this.max_focus -= normalizeStat(this.gear[slot].max_focus);

			this.gear[slot] = "none";
		}
	}


	meditateEnergy() {
		if (!(GM.loop_count % MEDITATE_RATE)) {
			this.giveFocus(rollRandom(3,1) + 1);
		}

		if (this.focus >= this.max_focus) {
			this.focus = this.max_focus;

			cmd_maxmeditate();
		}
	}
}