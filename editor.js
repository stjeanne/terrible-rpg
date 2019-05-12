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
			this.level = null;		// replace by a constructed level to which the active level object is copied.
			this.timer = null;
			this.canvasID = null;
			this.divID = null;
			this.toolID = null;

			this.m = null;	// canvas context
			this.t = null;	// canvas context

			this.redraw = false;

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
	}

	drawToolPane() {					// doesn't work rn
		this.t.fillStyle = "gray";
		this.t.beginPath();
		this.t.rect(0,0,TOOLW,TOOLH);
		this.t.fill();
	}



	loadLevel(levelname) {
		console.log("trying to load " + 'maps/' + levelname);

		$.getJSON('maps/' + levelname, lev => console.log("loaded " + lev))

		.done(lev => { 
			this.level = new Level(lev);
			this.redraw = true; 
			console.log("in the done section");
		})

		.fail(() => console.log("wasn't able to load the level :("));

	}
}


// create map

// switch map

// delete map

// save map

// write map to JSON file


let turnEditorOn = function() {
	ED = new Editor;
	ED.initEditor();
};

let turnEditorOff = function() {
	ED.endEditor();
};