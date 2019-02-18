// battle.js battlefield manager for the crap fields

// crapfield battle module

class BattleManager {
	constructor(battle_id = 0) {
		this.monster = null;
	}

	loadMonster(battle_id = 0) {
		this.monster = new Object;
		this.monster.hp = GM.monsters[battle_id].hp;
		this.monster.atk = GM.monsters[battle_id].atk;
		this.monster.val = GM.monsters[battle_id].val;

		GM.inbattle = true;

		console.log("new battle starts with " + this.monster.disp + ". HP starts at " + this.monster.hp + ", battle worth " + this.monster.val);
	}

	clearMonster() {
		console.log("battle over, erasing monster from memory");
		this.monster = null;
	}

	battleRound() {

		let pDMG = GM.PC.physAtk();
		let mDMG = this.monsterAtk();

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
				playerMessage("You steadily work to dislodge the " + this.monster.disp + "...");
			}

		}

	}

	monsterAtk() {
		return Math.floor(Math.random() * this.monster.atk);
	}

}