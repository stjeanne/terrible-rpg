// player JSON objects and functions related to updating/interacting

var PC = {
	name: "Caramella",
	motto: "I come from a file",
	health: defaultStat,
	stamina: defaultStat,
	focus: defaultStat,
	will: defaultStat,
	strength: defaultStat,
	location: defaultLocation
};

var displayCharSheet = function() {
	document.getElementById("charsheet").innerHTML =

	'<h2>Char Sheet</h2>' +
	'<ul><li>' + PC.name + '</li>' +
	'<li>Health: ' + PC.health + '</li>' +
	'<li>Location: ' + PC.location + '</l1>' + 
	'</ul>';
}