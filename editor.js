// Level editor for Cap 0 maps //

let ED = null;	// global variable for editor yeah yeah yeah
let eref = null; // yeah yeah yeah yeah

// screen layouts //


const MAPW = 600;
const MAPH = 600;

const TOOLS = ["toggle", "add", "erase", "focus"];

const TOOLW = 64;
const TOOLH = 600;

const ED_DEFAULTROOMSIZE = 32;
const ED_DEFAULTBORDER = 4;

class Editor {
	constructor(defaultmap = 'testmap.json') {		
			this.curmap = defaultmap;
			this.level = null;	
			this.timer = null;
			this.canvasID = null;
			this.divID = null;
			this.toolID = null;

			this.activetool = "focus";

			this.roomCoords = new Array;	// room coordinates for canvas

			this.m = null;	// canvas context
			this.t = null;	// canvas context

			this.mleft = null;
			this.mtop = null;
			this.mright = null;
			this.mbottom = null;

			this.targx = null;
			this.targy = null;
			this.realtarg = false;

			this.redraw = false;

			this.roomsize = ED_DEFAULTROOMSIZE;	// default value
			this.wallsize = ED_DEFAULTBORDER;

			this.prevmode = null;

			eref = this;
	}


	initEditor() {

			console.log("in editor mode");
			this.prevmode = GM.mode;
			GM.switchModes("editing");

			this.divID = document.createElement('div');
			this.divID.id = "editor";
			$('#wrapper').prepend(this.divID);

			this.canvasID = document.createElement('canvas');
			this.canvasID.className = "e_map";
			this.canvasID.width = MAPW;
			this.canvasID.height = MAPH;
			this.divID.appendChild(this.canvasID);
			this.m = this.canvasID.getContext("2d");
			
			this.toolID = document.createElement('canvas');
			this.toolID.className = "e_tool";
			this.toolID.width = TOOLW;
			this.toolID.height = TOOLH;
			this.divID.appendChild(this.toolID);
			this.t = this.toolID.getContext("2d");

			$('#editor').append("<button id=\"GUI_save\">Save Current Map</button>");
			$('#editor').append("<button id=\"GUI_saveAs\">Save As</button>");
			$('#editor').append("<button id=\"GUI_load\">Load Map</button>");
			$('#editor').append("<button id=\"GUI_new\">New Map</button>");

			$('#GUI_save').on("click", () => this.saveCurrentLevel());
			$('#GUI_saveAs').on("click", () => this.saveCurrentLevelAs());
			$('#GUI_load').on("click", () => this.loadLevel());
			$('#GUI_new').on("click", () => this.createNewLevel());

			$(this.divID).after()

			this.loadLevel(this.curmap);

			$('.e_map').on("mousemove", () => this.calcMousePos(event.offsetX, event.offsetY));
			$('.e_map').on("click", () => this.applyTool());

			this.timer = setInterval(this.editLoop, 10);
			this.editLoop();
	}

	editLoop() {
			if(eref.redraw) { 
				eref.drawWholeDangMap(); 
				eref.drawToolPane();
			}			
	}

	endEditor() {
		clearInterval(this.timer);
		$("#editor").remove();

		GM.switchModes(this.prevmode);

	}

// draw functions

	drawWholeDangMap() {
				let p = new Promise((resolve, reject) => {
					this.drawBlankMap();
					resolve();

				})

				p.then(() => this.drawMapLayout())
				.then(() => this.drawAllNullRooms())
				.then(() => this.drawAllActiveRooms())
				.then(() => { this.redraw = false; })
	}
	

	drawBlankMap() {
		this.m.fillStyle = "white";
		this.m.font = 'bold 8px';
		this.m.beginPath();
		this.m.rect(0,0, MAPW, MAPH)
		this.m.fill();
		return true;
	}

	drawMapLayout() {
		this.m.font = '12px Overpass Mono';
		this.m.fillStyle = 'red';
		this.m.fillText("current map: " + this.level.mapname, 0, 12);
		return true;
	}

	drawAllNullRooms() {
		this.roomCoords.forEach(r => {
			for(let j = 0; j < this.level.width; j++) { this.drawNullRoom(r,this.roomCoords[j])	}
		})
		return true;
	}

	drawAllActiveRooms() {

		this.level.rooms.forEach(r => {
			this.drawActiveRoom(r.x, r.y, r.pass);
		})
		return true;
	}

	drawToolPane() {					// doesn't work rn
		this.t.fillStyle = "#DDD";
		this.t.beginPath();
		this.t.rect(0,0,TOOLW,TOOLH);
		this.t.fill();
	}

	drawNullRoom(x,y) {
		console.log("drawing null space at " + x + ", " + y);
		this.m.fillStyle = "#DDD";

		let offs = Math.floor(this.roomsize / 2);

		this.m.fillRect(offs+x-1, offs+y-1, 3, 3);
	}

	drawActiveRoom(x,y,p) {	// passability not used yet

		console.log("drawing LIVE room at " + x + ", " + y);

		this.m.fillStyle = "black";
		this.m.fillRect(this.roomCoords[x],this.roomCoords[y],this.roomsize,this.roomsize);
	}

// coordinate functions

	setUpCanvasRoomLayout() {

		console.log("initial setup of canvas room layout");
		let lw = this.level.width * this.roomsize + (this.wallsize * (this.level.width + 1));
		let lh = lw;

		this.mleft = Math.floor(MAPW / 2) - Math.floor(lw / 2);
		this.mtop = Math.floor(MAPH / 2) - Math.floor(lh / 2);
		this.mright = this.mleft + (this.roomsize * this.level.width) + (this.wallsize * (this.level.width - 1));
		this.mbottom = this.mtop + (this.roomsize * this.level.height) + (this.wallsize * (this.level.height - 1));

		console.log("why don't we know room coords: " + this.roomCoords);

		for(let i = 0; i < this.level.width; i++) {
			this.roomCoords.push(this.mleft + (i * this.roomsize) + (i+1 * this.wallsize));
			console.log("pushed to room coordinates: " + this.roomCoords[i]);
		}

	}

	calcMousePos(x,y) {

		if (x < (this.mleft - this.wallsize) || 
			x > (this.mright + this.wallsize) || 
			y < (this.mtop - this.wallsize) ||
			y > (this.mbottom + this.wallsize)) {

			this.targx = null;
			this.targy = null;
			this.realtarg = false;
		}

		else {

			this.targx = Math.floor((x - this.mleft) / this.roomsize);	// right now this starts to break down w larger maps.
			this.targy = Math.floor((y - this.mtop) / this.roomsize);	// right now this starts to break down w larger maps.
			this.realtarg = true;
		}
	}


	getRoom(x, y) {	// takes an x y coordinate. if we're on a room, returns a reference to the room we're on. if not, returns false;

		return this.level.rooms.filter(r => (x == r.x) && (y == r.y));

	}

// tool palette

	applyTool() {

		console.log("clicked map at " + this.targx + " " + this.targy);

		switch(this.activetool) {
			case "toggle": this.toggleRoom(); break;
			case "focus": this.focusRoom(); break;
			default: 
		}
	}

	toggleRoom() {



		// if whichTile returns a reference: 
			// if the room has properties: check first, then remove that room from the array. 
			// else just remove it.
		// if whichTile doesn't return a reference: create a blank room with default passability and push it to the array.

		// toggle screen redrawing

	}

	focusRoom() {
		console.log("called focus room tool at target " + this.targx + ", " + this.targy);
		// focus on a room's param list to make changes as needed (esp to event/effects scripts, wall textures, enemy codes, etc.)

		if (this.realtarg) {
			console.log("focusing on room at target " + this.targx + ", " + this.targy + ", is it a room? " + this.getRoom(this.targx,this.targy));
		}
	}

	addRoom() {

	}

	eraseRoom() {

	}

// CRUD stuff

	saveCurrentLevel(maptarg = this.curmap) {
		console.log("saving current level to " + maptarg);

		$.ajax({
			type: "POST",
			url: "savemap.php",
			dataType: "json",
			async: false,
			data: {
				data: JSON.stringify(this.level),
				targ: "maps/" + maptarg
			},
			success: () => { console.log("should have saved file!")},
			failure: () => { console.log("oh no something went wrong with the save file")}
		});
	}

	saveCurrentLevelAs(fname = prompt("Enter filename to save as (must include extension):")) {
		this.saveCurrentLevel(fname);
	}

	createNewLevel() {
		console.log("creating a blank level");

		alert("Can't create new levels yet, be patient!");
	}

	loadLevel(levelname = prompt("Load which level?")) {
		console.log("trying to load " + 'maps/' + levelname);

		$.getJSON('maps/' + levelname, lev => console.log("loaded " + lev))

		.done(lev => { 

			this.level = new Level(lev);
			this.roomCoords = new Array;
			this.curmap = levelname;
			this.setUpCanvasRoomLayout();
			this.redraw = true; 
		})

		.fail(() => alert("wasn't able to load the level :("));

	}

}

////////////////////////////////
// CLASS DEFINITION ENDS HERE //
////////////////////////////////

let turnEditorOn = function() {
	ED = new Editor;
	ED.initEditor();
};

let turnEditorOff = function() {
	ED.endEditor();
};