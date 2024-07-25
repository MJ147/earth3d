import './style.css';
import * as THREE from 'three';
import { SpaceshipControls } from './objects/spaceship-controls.ts';
import { Starfield } from './objects/starfield.ts';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Earth } from './objects/earth.ts';

const earthRotationStep: number = 0.0001;

// const textureLoader = new THREE.TextureLoader();
// const sunTexture = textureLoader.load('assets/8k_sun.jpg');

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

// SUN

// Additive Blending for Glow
const glowGeometry = new THREE.IcosahedronGeometry(20, 12);
const glowMaterial = new THREE.MeshStandardMaterial({
	emissive: 0xffffdf,
	// emissiveMap: sunTexture,
	emissiveIntensity: 4,
});
const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
glowMesh.position.set(-900, 300, 900);
scene.add(glowMesh);
// camera.lookAt(new THREE.Vector3(-1000, 250, 750));

// Bloom Effect
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	0.4, // strength
	0.1, // radius
	0.1, // threshold
);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const starfield = new Starfield();

scene.add(starfield.getStars());

const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(-2, 0.5, 1.5);
scene.add(sunlight);

const spaceShipControls = new SpaceshipControls(camera, starfield.getStars());

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
