import './style.css';
import * as THREE from 'three';
import { SpaceshipControls } from './objects/spaceship-controls.ts';
import { Starfield } from './objects/starfield.ts';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { Earth } from './objects/earth.ts';
import { Sun } from './objects/sun.ts';

const earthRotationStep: number = 0.0001;

const scene = new THREE.Scene();

const w = window.innerWidth;
const h = window.innerHeight;

const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 10000);
camera.rotation.order = 'YXZ';
camera.position.z = 50;
camera.position.y = 20;
camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -0.36);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
});

const earth = new Earth();
scene.add(earth.earthGroup);

const starfield = new Starfield();
scene.add(starfield.getStars());

const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(-2, 0.5, 1.5);
scene.add(sunlight);

const spaceShipControls = new SpaceshipControls(camera, starfield.getStars());

const sun = new Sun();
scene.add(sun.sunMesh);

const composer = new EffectComposer(renderer);
const renderScene = new RenderPass(scene, camera);
composer.addPass(renderScene);
composer.addPass(sun.glowEffect);

camera.lookAt(new THREE.Vector3(-1000, 250, 750));

function animate() {
	requestAnimationFrame(animate);
	spaceShipControls.updateCamera();
	earth.earth.rotation.y += earthRotationStep;
	earth.darkSide.rotation.y += earthRotationStep;
	earth.clouds.rotation.y += earthRotationStep + 0.00002;

	renderer.render(scene, camera);
	composer.render();
}

animate();
