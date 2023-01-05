// MAZE.js -- implementation of the FOCUS mazes. //

const PASSCODES = ["empty", "solid"];
const MAZE_VERSION = 0.25; 	// now levels contain their own filenames

class Level {

	constructor(lev) {

		console.log("loading map " + lev.mapname);

		this.filename = lev.filename;
		this.mapname = lev.mapname;
		this.width = lev.width;
		this.height = lev.height;
		this.rooms = new Array;
		this.version = MAZE_VERSION;		// investigate this--every time you open the map it updates the version. i think this makes sense.

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
			this.flavor = r.flavor;
		}

		else {
			this.x = null;
			this.y = null;
			this.pass = PASSCODES[0];	// default to empty
			this.id = null;
			this.playerStart = false; // defaults to not being the player start point
			this.playerIsHere = false; // defaults to the player not being here
			this.flavor = null;
		}
	}

}


/* 
	PSYCHICVOYAGE is the manager class for traveling into the dream realm.

	We'll start by making it possible to launch as a test from the editor. (Nothing from the main game as yet.)


	args:
		0: right now it's the name of the map. Later it'll be a reconstructed map object using the passed param.
		1: "testing" -- if present, do it in test mode (use the defaults for things.)
*/


class PsychicVoyage {

		constructor(...args) {

			if (args[0] instanceof Level) {
				this.level = new Level(args[0]); // will assign a new Level to this
				this.PC = null; // will assign the player copy to this for purposes of updating location
			}
		

			this.commandStack = new Array;
			this.loopIsBroken = true;
			this.duration = 0;
			this.redraw = false;

			this.gfxLayer = null;

		}

		// loadLevel method: pulls level data from JSON and includes it in a Level object.
		// changeLevel method: calls loadLevel at a higher level of abstraction. based on a mapname plus x and y, loads the new level into memory and moves the player to it.
			// if x and y aren't defined, set them to the map start.





/////////////////////////
// PRIMARY MAZE MODE LOOP METHODS
////////////////////////////



		voyageLoop() {

			let voy = this;

			voy.timePasses();
			/*
				check the command stack + execute any extant commands.
				check whether anything has triggered a redraw:
					and if so, redraw it.
				check whether anything has broken the loop: 
					if not, return to the voyage loop.
			*/

//			if (voy.duration > 100) { voy.loopIsBroken = true; }

			console.log("looping in a psychic voyage, you better wait! ha ha ha! iteration " + voy.duration + ", loopIsBroken is " + voy.loopIsBroken);

			if (!voy.loopIsBroken) {
				setTimeout(() => voy.voyageLoop(), MAZE_LOOP_TIME)
			}

			else { voy.endVoyage(); }
		}

		timePasses() {
			this.duration++;
		}


		beginVoyage() {
			console.log("the psychic voyage BEGINS, exploring " + this.level.filename);

			let p = new Promise((resolve,reject) => resolve()) // we don't know what fancy gfx/sounds we may need

			.then(() => this.loadAnyResources())
			.then(() => this.setUpCanvasRoomLayout())			// build the maze layout in the DOM
			.then(() => this.setUpPlayerVariables())			// set up where the player is and is facing
			.then(() => this.setUpInitialMapState())			// load any initial commands into the stack
			.then(() => {

				this.loopIsBroken = false;
				this.duration = 0;
				this.voyageLoop();
			})




/* 
			CHAIN OF PROMISES

					load any resources we might need.

					p.setUpCanvasRoomLayout(); build the maze layout first as a separate function.


					set up where the player is + facing.
					
					load any initial commands onto the stack.

					when done, initiate the loop!
*/
		}

		endVoyage() {

			//clean up yr act

			console.log("the psychic voyage ENDS");

			this.clearUpGFX();	//eventually do this in a promise; for right now i'm tired

			if(GM.isThisAnEditorTest()) {
				GM.unsetTestingFlag();
				ED.unpauseEditor();
			}

			else {
				console.log("something weird happened: voyage ended not from the testing path; shouldn't be possible yet");
			}
		}


		emergencyExit()  {// for debug purposes: asks for an end to the voyage immediately. 
			console.log("call to emergencyExit; asking to end the psychic voyage");
			this.loopIsBroken = true;
		}

		switchLevel(lname,x,y) { // method for switching between levels. Should in practice never call anything not in the list of vetted game levels--needs behavior to cover that case

		}

/*		prepareLevel(lname,x,y) {
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

		} */


///////////
// GRAPHICS RELATED
///

		loadAnyResources(resolve,reject) {

			console.log("loading any resources we need");

			return new Promise(function(resolve,reject) {
				resolve();
			})
		}

		setUpCanvasRoomLayout() {

			let p = this;

			console.log("setting up the canvas");

			return new Promise(function(resolve,reject) {

				p.gfxLayer = document.createElement("div");
				p.gfxLayer.id = "psychicvoyage";

				resolve();

			})


//			return function(resolve);
//						canvas overlay
//						left and right stat windows
//						left and right HUDs
//						player message box

		}

		clearUpGFX() {
			$("#psychicvoyage").remove();
			this.gfxLayer = null;
		}

		setUpPlayerVariables() {
			console.log("setting up the player's vars");
			return new Promise(function(resolve,reject) {

				resolve();

			})
		}

		setUpInitialMapState() {
			console.log("setting up the initial map state");
			return new Promise(function(resolve,reject) {

				resolve();

			})
		}
}