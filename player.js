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
		this.stamina = plr.stamina;
		this.strength = plr.strength;
		this.will = plr.will;
		this.location = plr.location;
		this.cash = plr.cash;
		this.bank = plr.bank;
		this.creditlevel = plr.creditlevel;
		this.credit_max = plr.credit_max;
		this.debt = plr.debt;
		this.gear = {
			tool: "none",		// damage dealer
			body: "none",		// protect from damage (absorb)
			music: "none",		// increase speed (dodge), decrease focus faster
			pendant: "none", 	// protect from psychic damage (absorb)
			robe: "none",		// protect from psychic damage (dodge)
			statue: "none", 	// change effects of sigils
			ring: "none" 		// increase focus, focus rate
		};
		this.inventory = {}		// push items to it
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

	equipItem(slot, item) {
		if (slot == "tool") {
			let i = GM.getItemByName(item);
			this.unequipItem(slot);
			this.gear.tool = i;
			console.log("equipped " + i.disp + " as a tool.");
		}

		else {
			console.log("equipItem called for mysterious purposes.");
		}
	}

	unequipItem(slot) {	// pass in the actual inventory slot
/*		let s = this.gear.filter( function(sname) {
			return sname == slot;
		});*/

		if (slot == "tool") {
			if (this.gear.tool == "none") {
				console.log("nothing to unequip from slot " + slot + "!")
			}

			else {
				console.log("unequipping " + this.gear.tool.name + " from tool slot.");
				this.addInventory(this.gear.tool);
				this.gear.tool = "none";
			}
		}
	}

	getEquipSlotByName(slot) {

	}

	physAtk() {
		return Math.floor(Math.random() * this.strength) + 1;
	}

	meditateEnergy() {
		if (!(GM.loop_count % MEDITATE_RATE)) {
			this.giveFocus(rollRandom(6,1) + 1);
		}

		if (this.focus >= this.max_focus) {
			this.focus = this.max_focus;

			playerMessage("Your mind is beginning to wander... you stop meditating.");
			GM.switchModes("normal");
		}
	}

	dummyBattle() { // is this still used? I don't think so!
		if (!(GM.loop_count % MEDITATE_RATE)) {
			this.giveHealth(rollRandom(3,1) - 4);
			this.giveBank(rollRandom(6,2) + 2);
			this.giveFocus(-1);

			let trashOptions = ['crud', 'trash', 'junk', 'scum', 'garbage', 'one man\'s treasure', 'yech'];

			playerMessage("You cleared a small area of " + trashOptions[Math.floor(Math.random() * trashOptions.length)] + ". Whew.");
		}
	}

	addInventory(i) {
		console.log("theoretically added " + i.name + " to player inventory.");

		if(i.type == "food") {
			effect_food(i);
		}
	} 
}