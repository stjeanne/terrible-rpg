// effects.js -- covers all the effects of different items.

let effect_food = function(i) { // pass in the item
	GM.PC.giveHealth(i.pwr);
	GM.displayCharSheet();
	playerMessage("Bought " + i.disp + ": " + i.eff);
};

let effect_sleep = function(i) {
	GM.PC.tired = true;
	GM.displayCharSheet();
	playerMessage("Bought " + i.disp + ": " + i.eff);
}

