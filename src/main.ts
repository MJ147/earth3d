import './style.css';
import * as THREE from 'three';
import { SpaceshipControls } from './objects/spaceship-controls.ts';
import { Starfield } from './objects/starfield.ts';
import { Earth } from './objects/earth.ts';
import { Sun } from './objects/sun.ts';
import { GameCore } from './objects/game-core.ts';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const gameCore = new GameCore();
const earth = new Earth();
gameCore.addToScene(earth.earthGroup);

const starfield = new Starfield();
gameCore.addToScene(starfield.getStars());

const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(-2, 0.5, 1.5);
gameCore.addToScene(sunlight);

const sun = new Sun();
gameCore.addToScene(sun.sunMesh);
gameCore.addToComposer(sun.glowEffect);

const spaceShipControls = new SpaceshipControls(gameCore.camera, starfield.getStars());

// gameCore.camera.lookAt(new THREE.Vector3(-10, 10, 10));

// const loader = new GLTFLoader();
// let spaceship;
// loader.load(
// 	'assets/spaceships/spaceship.gltf', // Replace with the actual path to your FBX file
// 	(object) => {
// 		// The object is the loaded model
// 		spaceship = object.scene;
// 		spaceship.position.set(-10, 10, 10);

// 		gameCore.scene.add(spaceship);
// 	},
// 	(xhr) => {
// 		// Called when loading is in progress
// 		console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
// 	},
// 	(error) => {
// 		// Called when loading has errors
// 		console.error('An error happened', error);
// 	},
// );

function animate() {
	requestAnimationFrame(animate);
	spaceShipControls.updateCamera();
	earth.earth.rotation.y += earth.earthRotationStep;
	earth.darkSide.rotation.y += earth.earthRotationStep;
	earth.clouds.rotation.y += earth.earthRotationStep + 0.00002;

	gameCore.renderer.render(gameCore.scene, gameCore.camera);
	gameCore.composer.render();
}

animate();
