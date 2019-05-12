// MAZE.js -- implementation of the FOCUS mazes. //

class Level {

	constructor(lev) {

		console.log("loading map " + lev.mapname);

		this.mapname = lev.mapname;
		this.width = lev.width;
		this.height = lev.height;
		this.rooms = new Array();

		lev.rooms.forEach(r => this.rooms.push(r)); 
	}
}

class Room {
	constructor(r) {		// takes a room object from the rooms array

		this.x = r.x;
		this.y = r.y;
		this.pass = r.pass;
	}

}