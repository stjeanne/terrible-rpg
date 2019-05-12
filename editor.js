// Level editor for Cap 0 maps //

let ED = null;	// global variable for editor yeah yeah yeah
let eref = null; // yeah yeah yeah yeah

// screen layouts //


const MAPW = 600;
const MAPH = 600;

const TOOLW = 200;
const TOOLH = 600;

class Editor {
	constructor(defaultmap = 'testmap.json') {		
			this.curmap = defaultmap;
			this.level = null;	
			this.timer = null;
			this.canvasID = null;
			this.divID = null;
			this.toolID = null;

			this.m = null;	// canvas context
			this.t = null;	// canvas context

			this.redraw = false;

			this.roomsize = 8;	// default value
			this.roomborder = 2;

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
			this.t = this.canvasID.getContext("2d");

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

			this.timer = setInterval(this.editLoop, 10);
			this.editLoop();
	}

	editLoop() {
			if(eref.redraw) {
				eref.drawBlankMap();
//				eref.drawToolPane();		// for now this lives here, move it eventually to a more logical place
				eref.drawMapLayout();
				eref.redraw = false;
			}

	}

	endEditor() {
		clearInterval(this.timer);
		$("#editor").remove();

		GM.switchModes(this.prevmode);

	}


	drawBlankMap() {
		this.m.fillStyle = "white";
		this.m.font = 'bold 8px';
		this.m.beginPath();
		this.m.rect(0,0, MAPW, MAPH)
		this.m.fill();
	}

	drawMapLayout() {
		this.m.font = '8px Overpass Mono';
		this.m.fillStyle = 'red';
		this.m.fillText("current map: " + this.level.mapname, 0, 6);

		// code to iterate through the rooms array drawing each appropriately

	}

	drawNullRooms() {



	}

	drawToolPane() {					// doesn't work rn
		this.t.fillStyle = "gray";
		this.t.beginPath();
		this.t.rect(0,0,TOOLW,TOOLH);
		this.t.fill();
	}



	loadLevel(levelname = prompt("Load which level?")) {
		console.log("trying to load " + 'maps/' + levelname);

		$.getJSON('maps/' + levelname, lev => console.log("loaded " + lev))

		.done(lev => { 
			this.level = new Level(lev);

			this.setUpCanvasRoomLayout();

			this.redraw = true; 
		})

		.fail(() => alert("wasn't able to load the level :("));

	}

	setUpCanvasRoomLayout() {
		// based on the width of the level: 
		// width of the level should be room dimension (default 8, borders 2) * width
	}

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

	saveCurrentLevelAs(fname) {
		console.log("save as current level");

		// eventually prompts for a file name then calls saveCurrentLevel, to avoid Issues

	}

	createNewLevel() {
		console.log("creating a blank level");
		alert("Can't create new levels yet, be patient!");
	}
}


// switch map

// delete map

// write map to JSON file


let turnEditorOn = function() {
	ED = new Editor;
	ED.initEditor();
};

let turnEditorOff = function() {
	ED.endEditor();
};