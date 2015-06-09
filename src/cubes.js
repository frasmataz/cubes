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

var WIDTH = 1200;
var HEIGHT = 900;
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
var terrainSize = new THREE.Vector3(8,8,8);

init();
renderLoop();

function block(type) {
	this.type = type;
	var geometry = new THREE.BoxGeometry(1,1,1);
	var material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
	this.mesh = new THREE.Mesh( geometry, material );
}

function init() {
	prepareWebGL();
	generateWorld();
}

function renderLoop() {
	updateWorld();
	draw();
	window.requestAnimationFrame(renderLoop);
}

function prepareWebGL() {
	$container = $('#container');
	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene = new THREE.Scene();
	renderer.setSize(WIDTH, HEIGHT);
	$container.append(renderer.domElement);
}

function generateWorld() {
	addCamera();
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
				terrain[i][j][k] = new block("dirt");
			}
		}
	}

	for (var i=0; i < terrainSize.x; i++)
	{
		for (var j=0; j < terrainSize.y; j++)
		{
			for (var k=0; k < terrainSize.z; k++)
			{
				if (terrain[i][j][k].type == "dirt")
				{
					var cube = new block("dirt");
					scene.add( cube.mesh );
					cube.mesh.position.x = i;
					cube.mesh.position.y = j;
					cube.mesh.position.z = k;
				}
			}
		}
	}
}

function addCamera() {
	scene.add(camera);

	camera.position.set(6,4,8);
	camera.lookAt(new THREE.Vector3(terrainSize.x/2,terrainSize.y/2,terrainSize.z/2));
	
	controls = new THREE.OrbitControls( camera );
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

}

function draw() {
	renderer.render(scene, camera);

}