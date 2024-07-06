import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getStarfield } from './starfield/starfield.ts';

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

const scene = new THREE.Scene();

const w = window.innerWidth;
const h = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.rotation.order = 'ZYX';
camera.position.z = 5;
const axesHelper = new THREE.AxesHelper(2);
camera.add(axesHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
});

const controls = new OrbitControls(camera, renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.5 * Math.PI) / 180;

const textureLoader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
	map: textureLoader.load('src/assets/earthmap1k.jpg'),
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);
scene.add(earthGroup);

const starfield = getStarfield();
scene.add(starfield);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

// Variables for plane steering
let pitch = new THREE.Object3D();
let yaw = new THREE.Object3D();
let roll = new THREE.Object3D();
let speed = 0;

scene.add(roll);
roll.add(yaw);
yaw.add(pitch);
pitch.add(camera);

roll.position.set(0, 0, 0);
yaw.rotation.set(0, 0, 0);
pitch.rotation.set(0, 0, 0);
camera.position.set(0, 0, 5); // Start camera at origin of pitch

// Key state
const keys: any = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowLeft: false,
	ArrowRight: false,
	KeyA: false,
	KeyD: false,
	KeyW: false,
	KeyS: false,
};

// Update camera based on the plane steering
function updateCamera(): void {
	if (keys.ArrowUp) pitch.rotation.x -= 0.01;
	if (keys.ArrowDown) pitch.rotation.x += 0.01;
	if (keys.ArrowLeft) yaw.rotation.y += 0.01;
	if (keys.ArrowRight) yaw.rotation.y -= 0.01;
	if (keys.KeyA) roll.rotation.z += 0.01;
	if (keys.KeyD) roll.rotation.z -= 0.01;
	if (keys.KeyW) speed += 0.0002;
	if (keys.KeyS) speed -= 0.0002;

	// Move the camera forward in the direction it is facing
	const direction = new THREE.Vector3();
	camera.getWorldDirection(direction);
	camera.position.addScaledVector(direction, speed);
	roll.position.addScaledVector(direction, speed);
	pitch.position.addScaledVector(direction, speed);
	yaw.position.addScaledVector(direction, speed);

	starfield.position.addScaledVector(direction, speed / 1.1);
}

// Event listeners for keydown and keyup
function handleKeyDown(event: any) {
	if (keys.hasOwnProperty(event.code)) {
		keys[event.code] = true;
	}
}

function handleKeyUp(event: any) {
	if (keys.hasOwnProperty(event.code)) {
		keys[event.code] = false;
	}
}

function animate() {
	requestAnimationFrame(animate);
	updateCamera();
	earthMesh.rotation.y += 0.001;

	renderer.render(scene, camera);
}

animate();
