import './style.css';
import * as THREE from 'three';
import { SpaceshipControls } from './objects/spaceship-controls.ts';
import { Starfield } from './objects/starfield.ts';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { Earth } from './objects/earth.ts';
import { Sun } from './objects/sun.ts';
import { GameCore } from './objects/game-core.ts';

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

// gameCore.camera.lookAt(new THREE.Vector3(-1000, 250, 750));

function animate() {
	requestAnimationFrame(animate);
	spaceShipControls.updateCamera();
	earth.earth.rotation.y += earth.earthRotationStep;
	earth.darkSide.rotation.y += earth.earthRotationStep;
	earth.clouds.rotation.y += earth.earthRotationStep + 0.00002;

	gameCore.renderer.render(gameCore.scene, gameCore.camera);
	// gameCore.composer.render();
}

animate();
