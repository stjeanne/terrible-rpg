// Level editor for Cap 0 maps //

let ED = null;	// global variable for editor yeah yeah yeah

class Editor {
	constructor(mapname = null) {
			this.mapname = mapname;
			this.level = null;		// replace by a constructed level to which the active level object is copied.
			this.timer = null;
			this.canvasID = null;

			this.prevmode = null;
	}


	initEditor() {
			this.prevmode = GM.mode;
			GM.switchModes("editing");
			this.timer = setInterval(this.editLoop, MASTER_RATE);

	/*		this.canvasID = document.createElement('canvas');
			this.canvasID.className = */
	}

	editLoop() {
			console.log("the map editor loop is active!");
	}

	endEditor() {
		clearInterval(this.timer);
//		document.removeChild()
		GM.switchModes(this.prevmode);
	}


	drawMap() {

	}
}


// main editor loop

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