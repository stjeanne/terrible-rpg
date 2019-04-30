// STORY FILE //
/*

This is what runs the plot of the whole game. Will determine what to do based on certain flags.

*/

let selectDream = function(d = 0) {

	let dreams = [
	"A woman in a dream tells you, \"A ring can increase your maximum focus.\"", 
	"A woman in a dream tells you, \"There isn't any way out yet.\"",
	"A woman in a dream tells you, \"One day, meditation will benefit you...but not yet.\"",
	"As soon as you close your eyes, you see a new star, burning red near the constellation Hydra. It hangs over your dreams all night."
	];

	return dreams[Math.floor((Math.random()*dreams.length))];
};