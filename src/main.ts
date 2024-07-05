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
let pitch = 0; // Rotation around X axis
let yaw = 0; // Rotation around Y axis
let roll = 0; // Rotation around Z axis
let speed = 0;

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
	if (keys.ArrowUp) pitch -= 0.01;
	if (keys.ArrowDown) pitch += 0.01;
	if (keys.ArrowLeft) yaw += 0.01;
	if (keys.ArrowRight) yaw -= 0.01;
	// if (keys.KeyA) roll += 0.01;
	// if (keys.KeyD) roll -= 0.01;
	if (keys.KeyW) speed += 0.0002;
	if (keys.KeyS) speed -= 0.0002;

	// Update camera rotation
	camera.rotation.set(pitch, yaw, roll);

	// Move the camera forward in the direction it is facing
	const direction = new THREE.Vector3();
	camera.getWorldDirection(direction);
	camera.position.addScaledVector(direction, speed);
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
