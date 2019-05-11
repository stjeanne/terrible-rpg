// Level editor for Cap 0 maps //

let ED = null;	// global variable for editor yeah yeah yeah
let eref = null;

class Editor {
	constructor(mapname = null) {
			this.mapname = mapname;
			this.level = null;		// replace by a constructed level to which the active level object is copied.
			this.timer = null;
			this.canvasID = null;
			this.divID = null;
			this.toolID = null;

			this.m = null;	// canvas context
			this.t = null;	// canvas context

			this.mapw = null;
			this.maph = null;
			this.toolw = null;
			this.toolh = null;

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
			this.divID.appendChild(this.canvasID);
			this.m = this.canvasID.getContext("2d");
			this.mapw = $('.e_map').css('width');
			this.maph = $('.e_map').css('height');

			$('.e_map').css('width=' + this.mapw + ' height=' + this.maph);	// i know this is stupid but this fixes the coordinate system

			this.toolID = document.createElement('canvas');
			this.toolID.className = "e_tool";
			this.divID.appendChild(this.toolID);
			this.t = this.canvasID.getContext("2d");
			this.toolw = $('.e_tool').css('width');
			this.toolh = $('.e_tool').css('height');

			$('.e_tool').css('width=' + this.toolw + ' height=' + this.toolh);

			this.redraw = true;

			this.timer = setInterval(this.editLoop(), MASTER_RATE);
	}

	editLoop() {
			if(this.redraw) {
				console.log("set to redraw the blank map layer");
				eref.drawBlankMap();
			}

//			console.log("the map editor loop is active!");
	}

	endEditor() {
		clearInterval(this.timer);
		$("#editor").remove();

		GM.switchModes(this.prevmode);

	}


	drawBlankMap() {
		this.m.fillStyle = "green";
		this.m.font = 'bold 50px';
		this.m.fillText("Editor exists but is so busted",10,10);
//		this.m.fillRect(10,10, eref.mapw, eref.maph);
		this.redraw = false;
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