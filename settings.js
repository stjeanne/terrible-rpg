// all consts and junk live here now

const MASTER_RATE = 1000;
const GAME_VERSION = 0.2001;		// 0.2: introduces meditation systems.
const OLDEST_VERSION = 0.2;
const AUTOSAVE_RATE = 50;
let MEDITATION_IS_LIVE = false;
let DEBUG_MODE = false;

const CMD_PARSER = "&bull; ";
const LOG_LENGTH = 10;
const defaultLocation = "home"; 

const INIT_LOAN = 50;
const DEBT_SCALE = 1.4;
const INTEREST_RATE = 1.15;
const COMPOUND_RATE = 50;

const PRICE_OF_EGGS = 15;
const MEDITATE_RATE = 3;
const MEDITATE_GRACE_PERIOD = 3;	// 3 cycles before it dings you for moving the mouse
const CRAPFIELDS_RATE = 3;
const MEDITATION_DEPTH = 20;		// 20 ticks to get all the way down with meditation.

const BATTLE_MAX_ENERGY = 100;	// constant for a standard turn
const INIT_C = 50;			// phase of initiation
const TURN_ENERGY = 25;	// baseline deduction of initiative energy per turn

const HARDWARE_ST = 0;
const BODEGA_ST = 1;
const OCCULT_ST = 2;

const DEFAULT_MAPW = 16;
const DEFAULT_MAPH = 16;

const EQUIPSLOTS = ["tool", "body", "ring", "music", "pendant", "statue"];
const GAMEMODES = ["normal", "loading", "message", "death", "buying", "crapfields", "meditate", "equipchange", "testing"];	//one day useful to have this enumerated

const CREDITLEVELS = [100, 500, 2500, 10000, 65535, 700000];
const CXP_NEEDED = [0, 10, 100, 1000, 10000, 100000];	// obviously needs revision

let CSS_STIMBASE = [202,202,255];
let CSS_BUTTONBASE = [157,157,255];
let CSS_BUTTONHOVER = [117,117,253];
let CSS_BUTTONTEXT = [255,255,255];
let CSS_REDTEXT = [153,0,0];
let CSS_TEXT = [0,0,0];

const WORKING_LEVELS = ["debug.map"]; // an array of all levels in the active game
const MAPS_PATH = "maps/";
const MAXIMUM_MAZE_SIZE = 12;
const MAZE_LOOP_TIME = 2500; // 2.5 seconds between calling the update loop in PV