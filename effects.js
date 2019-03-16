// effects.js -- covers all the effects of different items.

let effect_food = function(i) { // pass in the item
	GM.PC.giveHealth(i.pwr);
	playerMessage("Bought " + i.disp + ": " + i.eff);
};

