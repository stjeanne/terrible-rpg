// anim.js -- animations for capitalism 0

let turnOnOverlay = () => {
	setMasterOverlay(0);
	$("#overlay").css("display", "block");
}

let setMasterOverlay = (opacity) => {

	console.log(`changing opacity of overlay layer to ${opacity}`);
	$("#overlay").css("opacity", opacity);
};