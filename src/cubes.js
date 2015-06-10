if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
	  return window.webkitRequestAnimationFrame ||
	  window.mozRequestAnimationFrame ||
	  window.oRequestAnimationFrame ||
	  window.msRequestAnimationFrame ||
	  function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
		  window.setTimeout( callback, 1000 / 60 );
	  };
	})();
}


$(document).keydown(function (e) {
	// Update the state of the attached control to "true"
	switch (e.keyCode) {
		case 87:
			currentPosition.z++;
			updateWorld();
			break;
		case 83:
			currentPosition.z--;
			updateWorld();
			break;
		case 65:
			currentPosition.x++;
			updateWorld();
			break;
		case 68:
			currentPosition.x--;
			updateWorld();
			break;
	}
});

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45,
  ASPECT = WIDTH/HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

var $container;

var renderer;
var camera;
var scene;
var controls;

var terrain;
var terrainSize = new THREE.Vector3(32,8,32);

var currentPosition = new THREE.Vector3(0,0,0);

init();
renderLoop();

function block(type) {
	this.type = type;

	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material;

	if (type == "dirt") {
		material = new THREE.MeshPhongMaterial({color: 0x00ff00});
		this.visible = true;
	} else if (type == "air") {
		material = new THREE.MeshPhongMaterial({color: 0x000000});
		this.visible = false;
	}
	this.mesh = new THREE.Mesh( geometry, material );
}

function init() {
	noise.seed(12389);
	prepareWebGL();
	generateWorld();
}

function renderLoop() {
	draw();
	window.requestAnimationFrame(renderLoop);
}

function prepareWebGL() {
	$container = $('#container');
	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene = new THREE.Scene();
	renderer.setSize(WIDTH, HEIGHT);
	addCamera();
	$container.append(renderer.domElement);
}

function generateWorld() {
	addLighting();

	// var cube = new THREE.Mesh( geometry, material );
	// scene.add( cube );

	terrain = [];

	for (var i=0; i < terrainSize.x; i++)
	{
		terrain[i] = [];
		for (var j=0; j < terrainSize.y; j++)
		{
			terrain[i][j] = [];
			for (var k=0; k < terrainSize.z; k++)
			{
				terrain[i][j][k] = getBlockAtLocation(i+currentPosition.x,j+currentPosition.y,k+currentPosition.z);
				if(terrain[i][j][k].visible)
					scene.add( terrain[i][j][k].mesh );
				terrain[i][j][k].mesh.position.x = i;
				terrain[i][j][k].mesh.position.y = j;
				terrain[i][j][k].mesh.position.z = k;
			}
		}
	}
}

function getBlockAtLocation(x,y,z) {
	var val = Math.abs(noise.simplex3(x, y, z)) *  256;
	if (val > 200)
		return new block("dirt");
	else
		return new block("air");
}

function addCamera() {
	scene.add(camera);

	camera.position.set(6,4,8);
	
	controls = new THREE.OrbitControls( camera );
	camera.lookAt(new THREE.Vector3(terrainSize.x/2,terrainSize.y/2,terrainSize.z/2));
	controls.damping = 0.2;
}

function addLighting() {
	var pointLight = new THREE.PointLight(0xFFFFFF);

	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	scene.add(pointLight);

	var ambientLight = new THREE.AmbientLight( 0x404040 );
	scene.add( ambientLight );
}

function updateWorld() {
	for (var i=0; i < terrainSize.x; i++)
	{
		for (var j=0; j < terrainSize.y; j++)
		{
			for (var k=0; k < terrainSize.z; k++)
			{
				scene.remove( terrain[i][j][k].mesh );
				terrain[i][j][k] = getBlockAtLocation(i+currentPosition.x,j+currentPosition.y,k+currentPosition.z);
				if(terrain[i][j][k].visible)
					scene.add( terrain[i][j][k].mesh );
				terrain[i][j][k].mesh.position.x = i;
				terrain[i][j][k].mesh.position.y = j;
				terrain[i][j][k].mesh.position.z = k;
			}
		}
	}
}

function draw() {
	renderer.render(scene, camera);
}