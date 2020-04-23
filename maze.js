// MAZE.js -- implementation of the FOCUS mazes. //

const PASSCODES = ["empty", "solid"];
const MAZE_VERSION = 0.2

class Level {

	constructor(lev) {

		console.log("loading map " + lev.mapname);

		this.mapname = lev.mapname;
		this.width = lev.width;
		this.height = lev.height;
		this.rooms = new Array;
		this.version - MAZE_VERSION;		// investigate this--every time you open the map it updates the version. i think this makes sense.

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

// NOTE: right now these just truncate anything not in their range which is surely not a great move. They also add new width without centering the old rooms.

	changeWidth(w) {
		this.width = w;
	}

	changeHeight(h) {
		this.height = h;
	}
}

/*

		what room parameters do we need? for now maybe just flavortext. eventually: enemy zones. warptargets. up. down. interact scripts.
*/

class Room {
	constructor(...args) {	

		if (args[0] instanceof Room) {
			this.x = r.x;
			this.y = r.y;
			this.pass = r.pass;
			this.id = null;		// this is a reference for a div
			this.playerStart = r.playerStart;
			this.playerIsHere = r.playerIsHere;
		}

		else {
			this.x = null;
			this.y = null;
			this.pass = PASSCODES[0];	// default to empty
			this.id = null;
			this.playerStart = false; // defaults to not being the player start point
			this.playerIsHere = false; // defaults to the player not being here
		}
	}

}


/* 
	PSYCHICVOYAGE is the manager class for traveling into the dream realm.

	We'll start by making it possible to launch as a test from the editor. (Nothing from the main game as yet.)



*/


class PsychicVoyage {

		constructor(...args) {

			if (args[0] instanceof PsychicVoyage) {
				// for now let's assume this never happens. one voyage at a time!
			}

			else {
				this.level = null; // will assign a new Level to this
				this.PC = null; // will assign the player copy to this for purposes of updating location
			}
		}

		// loadLevel method: pulls level data from JSON and includes it in a Level object.
		// changeLevel method: calls loadLevel at a higher level of abstraction. based on a mapname plus x and y, loads the new level into memory and moves the player to it.
			// if x and y aren't defined, set them to the map start.

		beginVoyage() {
			// load the current level
			alert("the psychic voyage BEGINS");

				// check whether we're in a live game. if we are, load the maze mode.

				/* else if we're in testing, 
					for now just load the minimap. (eventually will load some kind of live view.)

						load the player at the map's start position.
						load the minimap as the maze mode. 
						load the test controls.
							initially just "back to editor"
							WASD turn/forward/back tank controls. eventually these overload to the live controls plus the debut GUI.
							eventually: jump player to different locations. unclip player.

*/
			this.endVoyage();		// this will move to its own event once the tester controls are in.
		}

		endVoyage() {
			//clean up yr act
			alert("the psychic voyage ENDS");

			if(GM.mode == "testing") {
				ED.unpauseEditor();
			}

			else {
				console.log("something weird happened: voyage ended not from the testing path.");
			}
		}

		loadLevel(lname,x,y) {
			console.log("trying to load " + 'maps/' + lname);

			$.getJSON('maps/' + lname, lev => console.log("loaded " + lname + " into a PSYCHIC VOYAGE"))

			.done(lev => { 

				this.level = new Level(lev);
//				this.roomCoords = new Array;
//				this.curmap = levelname;
//				this.setUpCanvasRoomLayout();
//				this.redraw = true; 

				console.log ("the psychic voyage has loaded a levelll successfully")
			})

			.fail(() => alert("wasn't able to load the level :("));

		}

}