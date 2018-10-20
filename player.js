// player JSON objects and functions related to updating/interacting

// for right now this is stupid but

// this function isn't called RN. 
let updateCharSheet = function() {

	//console.log("called update CS");

	$("charsheet").html("<h2>Char Sheet</h2>" +
	'<ul><li>' + PC.name + '</li>' +
	'<li>\"' + PC.motto + '\"</li>' +
	'<li>Health: ' + PC.health + '</li>' +
	'<li>Focus: ' + PC.focus + '</li>' +
	'<li>Location: ' + PC.location + '</l1>' + 
	'</ul>');

//	console.log(PC);
}