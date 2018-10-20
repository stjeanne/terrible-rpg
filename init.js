// initialization file for weird game

var PC = new Object;


PC = {
	name: "FAILURE",
	motto: "raw code",
	health: defaultStat,
	stamina: defaultStat,
	focus: defaultStat,
	will: defaultStat,
	strength: defaultStat,
	location: defaultLocation,
}; 


function loadGameData() {

	var request;

	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else {
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}

	request.open('GET','player.json');
	request.onreadystatechange = function() {
		if ((request.status===200) && (request.readyState===4)) {
			PC = JSON.parse(request.responseText);
//			PC.name = playerData.player.name;
			console.log(PC);
		}

	}

	request.send();

	console.log(request);

//	displayCharSheet();	
} // loadGameData: loads game data from JSON files

var defaultStat = 10;
var defaultLocation = "home"; 