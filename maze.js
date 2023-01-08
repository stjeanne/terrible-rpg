// MAZE.js -- implementation of the FOCUS mazes. //

const PASSCODES = ["empty", "solid"];
const MAZE_VERSION = 0.25; 	// now levels contain their own filenames


const MM_SIZE_OF_PLAYER = 24;

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
			this.mm = null;				// drawing context for the minimap

			this.playerX = 0;			// we'll echo these three whenever the player moves, and set up initially based on map data.
			this.playerY = 0;			//
			this.playerF = MAZE_NORTH;	//

		}

		// loadLevel method: pulls level data from JSON and includes it in a Level object.
		// changeLevel method: calls loadLevel at a higher level of abstraction. based on a mapname plus x and y, loads the new level into memory and moves the player to it.
			// if x and y aren't defined, set them to the map start.





/////////////////////////
// PRIMARY MAZE MODE LOOP METHODS
////////////////////////////



		voyageLoop() {

			this.timePasses();
			/*
				check the command stack + execute any extant commands.
				check whether anything has triggered a redraw:
					and if so, redraw it.

			*/

			let voy = this;				// so we don't miss out on any changes made during the command executions

			if (this.redraw) {
				voy.drawMiniMap();
				this.redraw = false;
			}


			if (!(voy.duration % 5)) { console.log("looping in a psychic voyage. ESC to emergency exit. iteration " + voy.duration); }

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
			setMasterOverlay(1);

			let p = new Promise((resolve,reject) => resolve())

			.then(() => this.loadAnyResources())				// we don't know what fancy gfx/sounds we may need
			.then(() => this.setUpMazeCanvasLayout())			// build the maze layout in the DOM
			.then(() => this.setUpPlayerVariables())			// set up where the player is and is facing
			.then(() => this.setUpInitialMapState())			// load any initial commands into the stack
			.then(() => {

				this.loopIsBroken = false;
				this.duration = 0;
				this.redraw = true;
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

			setMasterOverlay(0);


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

////////////////////
// INITIAL SETUP


		loadAnyResources(resolve,reject) {

			console.log("loading any resources we need");

			return new Promise(function(resolve,reject) {
				resolve();
			})
		}

		setUpMazeCanvasLayout() {

			let p = this;

			console.log("setting up the canvas");

			return new Promise(function(resolve,reject) {

				console.log("inside the canvas setup promise, preparing to create");
				p.gfxLayer = document.createElement("div");
				p.gfxLayer.id = "psychicvoyage";
				p.mmCanvas = document.createElement("canvas");
				p.mmCanvas.id = "minimapCanvas";
				p.mm = p.mmCanvas.getContext("2d");

				$("#wrapper").prepend(p.gfxLayer);
				$("#psychicvoyage").append("<div id=\'minimap\'>");
				$("#minimap").append(p.mmCanvas);
				$("#psychicvoyage").append("<div id=\'stimuluswindow\'>");
				$("#psychicvoyage").append("<div id=\'leftstat\'>");
				$("#psychicvoyage").append("<div id=\'rightstat\'>");
				$("#psychicvoyage").append("<div id=\'leftHUD\'>");
				$("#psychicvoyage").append("<div id=\'rightHUD\'>");


				resolve();

			})

		}

		clearUpGFX() {
			$("#psychicvoyage").remove();
			this.gfxLayer = null;
		}

		setUpPlayerVariables() {

			let voy = this;

			console.log("setting up the player's vars");
			return new Promise(function(resolve,reject) {

				voy.playerX = 0;
				voy.playerY = 0;
				voy.playerF = MAZE_NORTH;

				resolve();

			})
		}

		setUpInitialMapState() {
			console.log("setting up the initial map state");
			return new Promise(function(resolve,reject) {

				resolve();

			})
		}



//////////////////////////
// REGULAR DRAWING - MINIMAP
////////////////////////////

		drawMiniMap() {
			this.drawBlankMap();
			this.drawMMRooms();
			this.drawMMPlayer();
		}


		drawBlankMap() {

			console.log("clearing out the old map");
			this.mm.clearRect(0,0, this.mmCanvas.width, this.mmCanvas.height);
		}

		drawMMRooms() {
			console.log("drawing minimap rooms");
		}


		drawMMPlayer() {

			console.log(`drawing player at ${this.playerX}, ${this.playerY}, facing ${this.playerF}`);

			let c = this.mm;

			c.fillStyle = "#FA0FFF";		// eventually parameterize this so the color changes based on state--would be cool if it's your dominant element

			let baseOffset = MM_SIZE_OF_PLAYER / 2;
			let pointOffset = (Math.floor(Math.sqrt((MM_SIZE_OF_PLAYER * MM_SIZE_OF_PLAYER) - (baseOffset * baseOffset)))) / 2;
			let triangleCenter = this.mmCanvas.height / 2;

			console.log(`here are the player's pos vars: base offset = ${baseOffset}, point offset = ${pointOffset}, triangle center = ${triangleCenter}`);

			switch(this.playerF) {
				case(MAZE_EAST):
					c.beginPath();					
					c.moveTo(triangleCenter - baseOffset, triangleCenter - pointOffset);
					c.lineTo(triangleCenter - baseOffset, triangleCenter + pointOffset);
					c.lineTo(triangleCenter + baseOffset, triangleCenter);
					c.fill();
				break;

				break;

				case(MAZE_SOUTH):
					c.beginPath();					
					c.moveTo(triangleCenter - baseOffset, triangleCenter - pointOffset);
					c.lineTo(triangleCenter, triangleCenter + pointOffset);
					c.lineTo(triangleCenter + baseOffset, triangleCenter - pointOffset);
					c.fill();
				break;

				case(MAZE_WEST):
					c.beginPath();					
					c.moveTo(triangleCenter + baseOffset, triangleCenter - pointOffset);
					c.lineTo(triangleCenter + baseOffset, triangleCenter + pointOffset);
					c.lineTo(triangleCenter - baseOffset, triangleCenter);
					c.fill();
				break;

				case(MAZE_NORTH):
					c.beginPath();					
					c.moveTo(triangleCenter - baseOffset, triangleCenter + pointOffset);
					c.lineTo(triangleCenter, triangleCenter - pointOffset);
					c.lineTo(triangleCenter + baseOffset, triangleCenter + pointOffset);
					c.fill();
				break;

			}


		}
}