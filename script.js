// Main animation loop
function animate() {
	requestAnimationFrame( animate );
	keyEvent();
	if (player.jumping) {
		player.jumpFrame();
	}
	player.update();
	/*camera.position.x = Math.sin(angle);
	angle += 0.1;*/
	renderer.render( scene, camera );
}
// Handles key events
function keyDownEvent(key) {
	keyvalue = key.key;
	switch (keyvalue) {
		case " ":
			keys.space = true;
			break;
	}
	console.log("Key " + keyvalue + " is active.");
}

function keyUpEvent(key) {
	keyvalue = key.key;
	switch (keyvalue) {
		case " ":
			keys.space = false;
			break;
	}
	console.log("Key " + keyvalue + " is not active");
}

function keyEvent() {
	if (keys.space) {
		if (jumpDelay == 0 && !player.jumping) {
			player.jumping = true;
			player.setUpJump();
			console.log("player.jumping = true");
		}
	}
}

function createObject(x, y, z) {
	var geometry = new THREE.BoxGeometry();
	edges = new THREE.EdgesGeometry(geometry);
	var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({
		color: 0xffffff
	}));
	var material = new THREE.MeshBasicMaterial({
		color: 0x00ff00
	});
	var object = new THREE.Mesh(geometry, material);
	object.position.x = x;
	object.position.y = y;
	object.position.z = z;
	objects.push(object);
	//objects.push(line);
	for (var i = 0; i < objects.length; i++) {
		scene.add(objects[i]);
	}
}

function buildNewBlock() {
	var x = objects[-1].x;
	var y = objects[-1].y;
	var z = objects[-1].z;
	z += 20;
	createObject(x, y, z);
}

function scrollScene() {
	for (var i = 0; i < objects.length; i++) {
		objects[i].z -= 1;
	}
	if (objects[0].z < camera.z) {
		objects.shift();
	}
	if (objects[-1].z <= camera.z + 20) {
		buildNewBlock();
	}
}

function lockChangeAlert() {
	if (document.pointerlockElement == canvas || document.moxpointerlockElement == canvas) {
		console.log("Pointer lock engaged.");
	} else {
		console.log("Pointer lock disengaged.");
	}
}

function mouseHandler(e) {
	x += e.movementX;
	y += e.movementY;
}

// Game Variables
var jumpDelay = 0;
var objects = [];
var keys = {
	space: false
};
var player = {
	y: 0,
	jumpStartY: null,
	jumpHeight: 5,
	jumpApex: null,
	jumpApexReached: false,
	jumpFinished: false,
	jumping: false,
	jumpFrame: function() {
		if (this.y >= this.jumpStartY && !this.jumpFinished) {
			console.log(this.y + " >= " + this.jumpStartY);
			if (this.y < this.jumpApex && !this.jumpApexReached) {
				console.log(this.y + " < " + this.jumpApex);
				this.y = Math.round((this.y + 0.1) * 100) / 100;
				console.log("incremented this.y");
			} else {
				if (this.y <= this.jumpStartY) {
					this.jumpFinished = true;
					this.y = this.jumpStartY;
					console.log("\n\tJump finished\n");
				} else {
					this.jumpApexReached = true;
					console.log("\njump apex reached\n");
					console.log(this.y + " >= " + this.jumpApex);
					this.y = Math.round((this.y - 0.1) * 100) / 100;
					console.log("deincrimented this.y");
				}
			}
		} else {
			this.jumping = false;
			this.cleanUpJump();
		}
	},
	calculateJumpApex: function() {
		this.jumpApex = this.jumpHeight / 2;
		return(0);
	},
	setUpJump: function() {
		this.jumpStartY = this.y;
		var retVal = this.calculateJumpApex();
		console.log("player jump was set up");
		return(retVal);
	},
	cleanUpJump: function() {
		this.jumpFinished = false;
		this.jumpApexReached = false;
		this.jumpApex = null;
		this.jumpStartY = null;
	},
	update: function() {
		camera.position.y = this.y + 3;
		if (this.jumping) {
			console.log("Camera y = " + camera.position.y);
		}
	}
};

// Sets the scene and camera
var scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Sets the renderer and adds it to DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Moves camera forward to make it visible
camera.position.z = 15;
camera.position.y = 3;

var lighting = new THREE.AmbientLight(0x404040);

// Creates game objects and positions them
for (var i = 0; i < 11; i++) {
	createObject(0, 0, i);
}

// Adds keyboard events
window.addEventListener("keydown", keyDownEvent);
window.addEventListener("keyup", keyUpEvent);

// Create Pointer Lock
var x = 0;
var y = 0;
var canvasColection = document.body.getElementsByTagName("canvas");
var canvas = canvasColection[0];
canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
canvas.onclick = function() {
	canvas.requestPointerLock();
}

document.addEventListener("pointerlockchange", lockChangeAlert, false);
document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
document.addEventListener("mousemove", mouseHandler);

// Starts animation
animate();