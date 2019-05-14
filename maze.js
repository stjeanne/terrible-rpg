// MAZE.js -- implementation of the FOCUS mazes. //

const PASSCODES = ["empty", "solid"];

class Level {

	constructor(lev) {

		console.log("loading map " + lev.mapname);

		this.mapname = lev.mapname;
		this.width = lev.width;
		this.height = lev.height;
		this.rooms = new Array;

		lev.rooms.forEach(r => this.rooms.push(r)); 
	}

	addRoom(x,y) {
		let r = new Room();
		r.x = x;
		r.y = y;

		this.rooms.push(r);

		console.log("added new room at " + x + ", " + y);
	}

	eraseRoom(x,y) {

 		let newRooms = new Array; 
 		newRooms = this.rooms.filter(rm => rm.x != x || rm.y != y );

 		this.rooms = newRooms;

		console.log("removed room at " + x + ", " + y + " (UNSAFELY~!)");
	}
}

class Room {
	constructor(...args) {	

		if (args[0] instanceof Room) {
			this.x = r.x;
			this.y = r.y;
			this.pass = r.pass;
			this.id = null;		// this is a reference for a div
		}

		else {
			this.x = null;
			this.y = null;
			this.pass = PASSCODES[0];	// default to empty
			this.id = null;
		}
	}

}