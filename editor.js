// Level editor for Cap 0 maps //

let ED = null;	// global variable for editor yeah yeah yeah
let eref = null; // yeah yeah yeah yeah

// screen layouts //


const MAPW = 600;
const MAPH = 600;

const TOOLS = ["toggle", "add", "erase", "focus", "playerstart"];

const TOOLW = 64;
const TOOLH = 600;
const TOOLSIZE = 32;

const ED_DEFAULTROOMSIZE = 24;
const ED_DEFAULTBORDER = 4;

class Editor {
	constructor(defaultmap = 'blank.map') {		
			this.curmap = defaultmap;
			this.level = null;	
			this.timer = null;
			this.canvasID = null;
			this.divID = null;
			this.toolID = null;

			this.activetool = "toggle";

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

			this.toolList = new Array; // blank array of tools
			this.numTools = 0;

			eref = this;
	}


	initEditor() {

			console.log("in editor mode");
			this.prevmode = GM.mode;
			GM.switchModes("editing");

			this.divID = document.createElement('div');
			this.divID.id = "editor";
			$('#wrapper').prepend(this.divID);

/*

			Revise how this works:

				After we create the editor element,
				Use jquery to create e_window
					within it e_main and e_properties.
					create e_titlebar
					create e_GUI
					create <div> e_tools
					create <div> e_test
*/


//			(Why doesn't the below work? Issue with working directly in DOM vs jquery)

			$(this.divID).append("<div class=\"e_window\"><div class=\"e_main\">");
//			$(this.divID).append("<div class=\"e_main\">");

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

			$(this.divID).append("</div></div>");

			$(this.divID).append("<p>");
			this.setTool("toggle");

			this.AddTool("toggle");
			this.AddTool("playerstart");
			this.AddTool("focus");
			this.AddTool("entityAdd");
			this.AddTool("entityFocus");

			this.PrepGUI();


			$(this.divID).after()

			this.loadLevel(this.curmap);


			$('.e_map').on("mousemove", () => this.calcMousePos(event.offsetX, event.offsetY));
			$('.e_map').on("click", () => this.applyTool(this.targx,this.targy));

			$('.e_tool').on("click", () => console.log("clicked the tool palette!"));


			this.timer = setInterval(this.editLoop, 10);
			this.editLoop();
	}

	AddTool(tool) {
		this.toolList.push(tool);
		this.numTools++;

		$('#editor').append("<button id=\"TOOL_" + tool + "\">" + tool + "</button>");
		$('#TOOL_' + tool).on("click", () => this.setTool(tool));


		console.log("added " + tool + " to the tool list, number of tools is now " + this.numTools);

	}

	PrepGUI() { // make this better later -- create this in the e_main div after the canvas
			$('#editor').append("<p>");
			$('#editor').append("<button id=\"GUI_save\">Save Current Map</button>");
			$('#editor').append("<button id=\"GUI_saveAs\">Save As</button>");
			$('#editor').append("<button id=\"GUI_load\">Load Map</button>");
			$('#editor').append("<button id=\"GUI_new\">New Map</button>");
			$('#editor').append("<button id=\"GUI_test\">TEST</button>");


			$('#GUI_save').on("click", () => this.saveCurrentLevel());
			$('#GUI_saveAs').on("click", () => this.saveCurrentLevelAs());
			$('#GUI_load').on("click", () => this.loadLevel());
			$('#GUI_new').on("click", () => this.createNewLevel());
			$('#GUI_test').on("click", () => this.testLevel());

			let s = "";

			this.toolList.forEach(tool => {
				s += "<option value=\"" + tool + "\">" + tool + "</option>";
			});

			$('#editor').append("<select id=\"GUI_adhoctools\">" + s + "</select>");

	}

	editLoop() {
			if(eref.redraw) { 
				eref.drawWholeDangMap(); 
				eref.drawToolPane();
			}			
	}

	pauseEditor() {
		console.log("stub, pausing the editor!");
	}

	unpauseEditor() {
		console.log("stub, unpausing the editor!");
		GM.switchModes("editing");
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
		this.m.font = '16px Overpass Mono';
		this.m.fillStyle = 'red';
		this.m.fillText("current map: " + this.level.mapname, 8, 20);
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
			if (r.playerStart == true) {
				this.drawPlayerStart(r.x,r.y);
			}
		})
		return true;
	}

	drawToolPane() {					// doesn't work rn
		this.t.fillStyle = "#DDC";
		this.t.beginPath();
		this.t.rect(0,0,TOOLW,TOOLH);
		this.t.fill();

		let i = 0;

		this.toolList.forEach(tool => {

			this.t.fillStyle = "#F00";
			this.t.fillRect(4, (4 * (i + 1)) + (TOOLSIZE * i), TOOLSIZE, TOOLSIZE);
			i++;

			console.log("drawing button for " + tool);
		})
		/*

			so ideally we add certain tools to the pane
			and we draw the art for each tool that we have.

		*/
	}

	drawNullRoom(x,y) {
		this.m.fillStyle = "#DDD";

		let offs = Math.floor(this.roomsize / 2);

		this.m.fillRect(offs+x-1, offs+y-1, 3, 3);
	}

	drawActiveRoom(x,y,p) {	// passability not used yet

		console.log("drawing LIVE room at " + x + ", " + y);

		this.m.fillStyle = "#776";
		this.m.fillRect(this.roomCoords[x], this.roomCoords[y], this.roomsize, this.roomsize);
	}

	drawPlayerStart(x,y) {
		console.log("drawing player start");
		this.m.fillStyle = "#0A0";
		this.m.fillRect(this.roomCoords[x], this.roomCoords[y], this.roomsize, this.roomsize);
	}

// coordinate functions

	setUpCanvasRoomLayout() {

		console.log("initial setup of canvas room layout");
		let lw = this.level.width * this.roomsize + (this.wallsize * (this.level.width - 1));
		let lh = lw;

		this.mleft = Math.floor(MAPW / 2) - Math.floor(lw / 2); 
		this.mtop = Math.floor(MAPH / 2) - Math.floor(lh / 2);
		this.mright = this.mleft + (this.roomsize * (this.level.width - 1)) + (this.wallsize * (this.level.width - 1));
		this.mbottom = this.mtop + (this.roomsize * (this.level.height - 1)) + (this.wallsize * (this.level.height - 1));

		console.log("why don't we know room coords: " + this.roomCoords);

		for(let i = 0; i < this.level.width; i++) {
			this.roomCoords.push(this.mleft + (i * this.roomsize) + (i * this.wallsize));
			console.log("pushed to room coordinates: " + this.roomCoords[i]);
		}

	}

	calcMousePos(x,y) {

		if (x < (this.mleft) || 
			x > (this.mright + this.roomsize) || 
			y < (this.mtop) ||
			y > (this.mbottom + this.roomsize)) {

			this.targx = null;
			this.targy = null;
			this.realtarg = false;
		}

		else {

			// normalize x and y from here

			x -= this.mleft;
			y -= this.mtop;

			// this still breaks down with larger maps although it's closer. The basic idea:

			// we first have to calculate the ballpark region we're in: x divided by the size of a room. that gives us the rough
			// number of wall offsets.
			// we then add back the number of wall offsets and then divide by the room size. there's certainly a better way to do this.

			let xzone = Math.floor(x / this.roomsize);	
			let yzone = Math.floor(y / this.roomsize);	

			this.targx = Math.floor((x - (this.wallsize * xzone)) / this.roomsize);
			this.targy = Math.floor((y - (this.wallsize * yzone)) / this.roomsize);

			this.realtarg = true;

		}
	}


	getRoom(x, y) {	// takes an x y coordinate. if we're on a room, returns a reference to the room we're on. if not, returns false;
		return this.level.rooms.filter(r => (x == r.x) && (y == r.y))[0];
	}

// tool palette

	setTool(tool) {
		this.activetool = tool;
		console.log("changed active tool to " + tool);
	}

	applyTool(x, y) {

		console.log("clicked map at " + x + " " + y);

		switch(this.activetool) {
			case "toggle": this.toggleRoom(x,y); break;
			case "focus": this.focusRoom(x,y); break;
			case "playerstart": this.movePlayerStart(x,y); break;
			case "addEntity": this.addEntity(x,y); break;
			case "entityFocus": this.entityFocus(x,y); break;
			default: 
		}
	}

	toggleRoom(x,y) {

		let r = this.getRoom(x,y);

//		if (r ==Array.isArray(r) && r.length == 1) {	// will fail if we're in more than one room. (VESTIGIAL, assumes an array from getRoom, no longer true)

		if (r != undefined) {	// i think this works but maybe i don't understand anything
			console.log("in a room, attempting to erase");

			eref.level.eraseRoom(x,y);
			eref.redraw = true;
		}

		else if ((x >= eref.level.width) || (y >= eref.level.height) ) {
			console.log("clicked outside bounds of the map. doing nothing");
		}

/*		else if ((x == null) || (y == null)) {
			console.log("x and or y are null which seems like bad news");
		}*/

		else if (r == undefined) {			
			console.log("we are not in a room! attempting to add");

			eref.level.addRoom(x,y);
			eref.redraw = true;
		}
	}

	focusRoom(x,y) {
		console.log("called focus room tool at target " + this.targx + ", " + this.targy);
		// focus on a room's param list to make changes as needed (esp to event/effects scripts, wall textures, enemy codes, etc.)

		if (this.realtarg) {

			let fr = eref.getRoom(eref.targx,eref.targy);

			if (fr != undefined) {
				alert("FOCUS on the room at " + this.targx + ", " + this.targy + ": " + this.getRoom(this.targx,this.targy).flavor);				
			}

			else {
				console.log("nothing to focus on.");
			}
		}
	}

	movePlayerStart(x,y) {
		let r = this.getRoom(x,y);

		eref = this;

		if (r != undefined) {	// if we got a legit room

			eref.level.rooms.forEach(room => room.playerStart = false);	// get rid of the current player start location

			r.playerStart = true;

			console.log("moved player start to " + x + ", " + y + "!");

			eref.redraw = true;
		}

	}

	addEntity(x,y) {
		console.log("adding entity tool at " + x + " " + y);
	}

	entityFocus(x,y) {
		console.log("focusing on the entity at " + x + " " + y);
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
			success: () => { console.log("saved file!")},
			failure: () => { console.log("oh no something went wrong with the save file")}
		});
	}

	saveCurrentLevelAs(fname = prompt("Enter filename to save as (must include .map extension):")) {
		if (fname != null) {
			this.saveCurrentLevel(fname);
			this.curmap = fname;		
		}
	}

	createNewLevel(levelsquare = prompt("Creating new level. What size square? (1-12)")) {

		console.log(Number(levelsquare));

		if (typeof Number(levelsquare) == 'number') {
			if ((levelsquare > 0) && (levelsquare <= 12)) {
				console.log("loading a blank map.");

				$.getJSON('maps/blankmap.json', lev => console.log("loaded " + lev))

				.done(lev => {
					this.level = new Level(lev);
					this.level.width = levelsquare;
					this.level.height = levelsquare;
					this.roomCoords = new Array;

					this.saveCurrentLevelAs();
					this.setUpCanvasRoomLayout();
					this.redraw = true;
				})

				.fail(() => alert("couldn't load the blank map."));
			}

			alert("failed to create new level: size outside of range.")
		}

		else {
			console.log("failed: issue with typeof");
		}
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

	testLevel() {
		console.log("testing level " + this.curmap + ", hold onto yr butts");

		// need to think about this.

		this.pauseEditor(); 		// we make the editor invisible. (happens in pause editor.)
		GM.switchModes("testing");
		// - we initiate the psychic voyage with the current level data.
		// - we change the editor mode away from editing, but leave the editor active. (We do make sure to hide the editor in CSS so we can't click.)
		// - when the psychic vision is over, it will know to call the restore editor method to resume from where we were. (How? makes a call from the end vision method.)

		let PV = new PsychicVoyage(this.curmap); 		// - we spawn a new psychic voyage.

		PV.beginVoyage();
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