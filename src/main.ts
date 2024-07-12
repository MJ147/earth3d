import './style.css';
import * as THREE from 'three';
import { SpaceshipControls } from './classes/spaceship-controls.ts';
import { Starfield } from './classes/starfield.ts';
// import { getFresnelMat } from './classes/frestel.ts';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const earthRotationStep: number = 0.0001;

const textureLoader = new THREE.TextureLoader();
const earthDayTexture = textureLoader.load('assets/8k_earth_daymap.jpg');
const earthNightTexture = textureLoader.load('assets/8k_earth_nightmap.jpg');
const earthCloudsTexture = textureLoader.load('assets/8k_earth_clouds.jpg');
const sunTexture = textureLoader.load('assets/8k_sun.jpg');

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

// EARTH
const earthGroup = new THREE.Group();
earthGroup.rotation.y = 0.5;
earthGroup.rotation.z = (-23.5 * Math.PI) / 180;
scene.add(earthGroup);

const geometry = new THREE.IcosahedronGeometry(10, 12);
const material = new THREE.MeshStandardMaterial({ map: earthDayTexture });
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const cloudMaterial = new THREE.MeshStandardMaterial({
	map: earthCloudsTexture,
	transparent: true,
	opacity: 0.9,
	blending: THREE.AdditiveBlending,
});
const cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
cloudMesh.scale.setScalar(1.006);
earthGroup.add(cloudMesh);

const lightMat = new THREE.MeshBasicMaterial({
	map: earthNightTexture,
	blending: THREE.AdditiveBlending,
	transparent: false,
	opacity: 0.01,
});
const lightMesh = new THREE.Mesh(geometry, lightMat);
lightMesh.scale.setScalar(1.003);

earthGroup.add(lightMesh);
// const fresnelMat = getFresnelMat();
// const fresnelMesh = new THREE.Mesh(geometry, fresnelMat);
// fresnelMesh.scale.setScalar(1.01);
// earthGroup.add(fresnelMesh);

// SUN

// Additive Blending for Glow
const glowGeometry = new THREE.IcosahedronGeometry(20, 12);
const glowMaterial = new THREE.MeshStandardMaterial({
	emissive: 0xffffff,
	emissiveMap: sunTexture,
	emissiveIntensity: 4,
});
const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
glowMesh.position.set(-100, 25, 75);
scene.add(glowMesh);

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
	earthMesh.rotation.y += earthRotationStep;
	lightMesh.rotation.y += earthRotationStep;
	cloudMesh.rotation.y += earthRotationStep + 0.00002;

	renderer.render(scene, camera);
	composer.render();
}

animate();
