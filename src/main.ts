import './style.css';
import * as THREE from 'three';
import { getStarfield } from './functions/starfield.ts';
import { SpaceshipControls } from './classes/spaceship-controls.ts';

const earthRotationStep: number = 0.0001;

const textureLoader = new THREE.TextureLoader();
const earthDayTexture = textureLoader.load('assets/8k_earth_daymap.jpg');
const earthNightTexture = textureLoader.load('assets/8k_earth_nightmap.jpg');

const scene = new THREE.Scene();

const w = window.innerWidth;
const h = window.innerHeight;

const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 10000);
camera.rotation.order = 'YXZ';
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
});

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.5 * Math.PI) / 180;

const geometry = new THREE.IcosahedronGeometry(10, 12);
const material = new THREE.MeshStandardMaterial({
	map: earthDayTexture,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);
scene.add(earthGroup);

const starfield = getStarfield();
scene.add(starfield);

const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(-2, 0.5, 1.5);
scene.add(sunlight);

const lightMat = new THREE.MeshBasicMaterial({
	map: earthNightTexture,
	blending: THREE.AdditiveBlending,
	transparent: true,
	opacity: 0.2,
});

const lightMesh = new THREE.Mesh(geometry, lightMat);

earthGroup.add(lightMesh);

const spaceShipControls = new SpaceshipControls(camera, starfield);

function animate() {
	requestAnimationFrame(animate);
	spaceShipControls.updateCamera();
	earthMesh.rotation.y += earthRotationStep;
	lightMesh.rotation.y += earthRotationStep;

	renderer.render(scene, camera);
}

animate();
