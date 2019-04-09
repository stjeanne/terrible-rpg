// battle.js battlefield manager for the crap fields

// crapfield battle module

class BattleManager {
	constructor(battle_id = 0) {
		this.monster = new Object;
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

		console.log("new battle starts with " + this.monster.disp + ". HP starts at " + this.monster.hp + ", battle worth " + this.monster.val);
	}

	clearMonster() {
		console.log("battle over, erasing monster from memory");
		this.monster = null;
		this.monster = new Object;
	}

	battleRound() {

		let pDMG = GM.PC.physAtk() - this.monsterDef();
		let mDMG = this.monsterAtk() - GM.PC.physDef();

		if (pDMG < 0) { pDMG = 0; }
		if (mDMG < 0) { mDMG = 0; }

		console.log("attacking: PC does " + pDMG + ", monster does " + mDMG);

		GM.PC.health -= mDMG;

		if (GM.PC.health <= 0) {
			GM.switchModes("death");
		}

		else {
			this.monster.hp -= pDMG;

			if (this.monster.hp <= 0) {
				playerMessage("Success! You've cleared out the " + this.monster.disp + ".");
				GM.endBattle();
			}

			else {
				playerMessage("You steadily work to dislodge the " + this.monster.disp + "! (<span class=\"dmg\">" + pDMG + "</span> damage)");
				playerMessage("The " + this.monster.disp + " " + this.monster.attack_message + " (<span class=\"dmg\">" + mDMG + "</span> damage)");
			}

		}

	}

	monsterAtk() {
		return Math.floor(rollRandom(3,1) + (.5 * this.monster.atk)); // so 1 ATK ranges from .5 + 1 to .5 + 3, or 1-3. Can be mitigated by ABS.
	}

	monsterDef() {
		return Math.floor(rollRandom(3,1) + (.25 * this.monster.agi));
	}

}