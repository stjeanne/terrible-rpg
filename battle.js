// battle.js battlefield manager for the crap fields

// crapfield battle module

class BattleManager {
	constructor(battle_id = 0) {
		this.monster = new Object;
		this.PCcounter = 0;
		this.Mcounter = 0;
		this.battleover = false;
	}

	loadMonster(battle_id = 0) {
		this.monster.art = GM.monsters[battle_id].art;
		this.monster.disp = GM.monsters[battle_id].disp;
		this.monster.name = GM.monsters[battle_id].name;
		this.monster.attack_message = GM.monsters[battle_id].attack_message;
		this.monster.hp = GM.monsters[battle_id].hp;
		this.monster.atk = GM.monsters[battle_id].atk;
		this.monster.agi = GM.monsters[battle_id].agi;
		this.monster.val = GM.monsters[battle_id].val;

		GM.inbattle = true;
		this.battleover = false;
		this.PCcounter = this.rollInit();	// player usually loses advantage
		this.Mcounter = this.rollInit() - INIT_C;

		console.log("new battle starts with " + this.monster.disp + ". HP starts at " + this.monster.hp + ", battle worth " + this.monster.val);
	}

	clearMonster() {
		console.log("battle over, erasing monster from memory");
		this.PCcounter = 0;
		this.Mcounter = 0;
		this.monster = null;
		this.monster = new Object;
	}

	battleRound() {

		// flow: player gets advantage in a tie. //

		console.log("new round: player initiative = " + this.PCcounter + " monster initiative " + this.Mcounter);


		if (this.PCcounter <= 0) {		// if it's the player's turn
			let pDMG = this.physAtk() - this.monsterDef();
			if (pDMG < 0) { pDMG = 0; }

			this.monster.hp -= pDMG;

			console.log("player's turn arrives, player does " + pDMG + ". Monster's HP: " + this.monster.hp);

			playerMessage("You steadily work to dislodge the " + this.monster.disp + "! (<span class=\"pdmg\">" + pDMG + "</span> damage)");

				if (this.monster.hp <= 0) {
					playerMessage("Success! You've cleared out the " + this.monster.disp + ".");
					this.battleover = true;	// monster's turn never comes
					GM.endBattle();
				}

				else {

				}

		}
		

		if (this.Mcounter <= 0 && !this.battleover) {	// if it's the monster's turn--not else if!
			let mDMG = this.monsterAtk() - this.physDef();
			if (mDMG < 0) { mDMG = 0; }

			GM.PC.health -= mDMG;

			console.log("enemy turn arrives, enemy does " + mDMG + ". Player's HP: " + GM.PC.health);

			if (GM.PC.health <= 0) {
				GM.switchModes("death");
			}

			else {
				playerMessage("The " + this.monster.disp + " " + this.monster.attack_message + " (<span class=\"dmg\">" + mDMG + "</span> damage)");
			}
		}

		this.PCcounter -= (TURN_ENERGY + randomRange(-2,8) + Math.floor(GM.PC.AGI / 4));
		this.Mcounter -= (TURN_ENERGY + randomRange(-2,8) + Math.floor(this.monster.agi / 4));
	}

	physAtk() {
		this.PCcounter += BATTLE_MAX_ENERGY;
		return rollRandom(3,1) + Math.floor(0.5 * GM.PC.STR);
	}

	physDef() {
		return rollRandom(3,1) + Math.floor(0.25 * GM.PC.AGI) + Math.floor(0.25 + GM.PC.ABS);
	}

	monsterAtk() {
		this.Mcounter += BATTLE_MAX_ENERGY;
		return Math.floor(rollRandom(3,1) + (.5 * this.monster.atk)); // so 1 ATK ranges from .5 + 1 to .5 + 3, or 1-3. Can be mitigated by ABS.
	}

	monsterDef() {
		return Math.floor(rollRandom(3,1) + (.25 * this.monster.agi));
	}


	rollInit() {
		return Math.floor(INIT_C / 3) + Math.floor(Math.random() * 10) - 5;
	}
}