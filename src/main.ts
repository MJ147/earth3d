import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getStarfield } from './starfield/starfield.ts';

interface ClampedValue {
	value: number;
	step: number;
	min: number;
	max: number;
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

const scene = new THREE.Scene();

const w = window.innerWidth;
const h = window.innerHeight;

const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 10000);
camera.rotation.order = 'YXZ';
camera.position.z = 50;

const axesHelper = new THREE.AxesHelper(100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
});

new OrbitControls(camera, renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.5 * Math.PI) / 180;
earthGroup.add(axesHelper);

const textureLoader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(10, 12);
const material = new THREE.MeshStandardMaterial({
	map: textureLoader.load('src/assets/8k_earth_daymap.jpg'),
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);
scene.add(earthGroup);

const starfield = getStarfield();
scene.add(starfield);

const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(-2, 0.5, 1.5);
scene.add(sunlight);

interface AxisRotation {
	clampedValue: ClampedValue;
	axis: THREE.Vector3;
}

const lightMat = new THREE.MeshBasicMaterial({
	map: textureLoader.load('src/assets/8k_earth_nightmap.jpg'),
	blending: THREE.AdditiveBlending,
	transparent: true,
	opacity: 0.2,
});

const lightMesh = new THREE.Mesh(geometry, lightMat);

earthGroup.add(lightMesh);

let pitch: AxisRotation = {
	clampedValue: { value: 0, step: 0.0001, min: -0.005, max: 0.005 },
	axis: new THREE.Vector3(1, 0, 0),
};
let yaw: AxisRotation = {
	clampedValue: { value: 0, step: 0.0001, min: -0.005, max: 0.005 },
	axis: new THREE.Vector3(0, 1, 0),
};
let roll: AxisRotation = {
	clampedValue: { value: 0, step: 0.0001, min: -0.005, max: 0.005 },
	axis: new THREE.Vector3(0, 0, 1),
};
// let speed = 0;
const velocity = new THREE.Vector3(0, 0, 0);

const keys: { [key: string]: boolean } = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowLeft: false,
	ArrowRight: false,
	KeyA: false,
	KeyD: false,
	KeyW: false,
	KeyS: false,
	KeyQ: false,
	KeyE: false,
};

function rotateCamera(increase: boolean, reduce: boolean, { axis, clampedValue }: AxisRotation) {
	if (increase && clampedValue.value < clampedValue.max) clampedValue.value += clampedValue.step;
	if (reduce && clampedValue.value > clampedValue.min) clampedValue.value -= clampedValue.step;

	camera.rotateOnAxis(axis, clampedValue.value);
}

function updateCamera(): void {
	rotateCamera(keys.ArrowDown, keys.ArrowUp, pitch);
	rotateCamera(keys.ArrowLeft, keys.ArrowRight, yaw);
	rotateCamera(keys.KeyQ, keys.KeyE, roll);

	// if (keys.KeyW) speed += 0.0002;
	// if (keys.KeyS) speed -= 0.0002;

	// Update camera rotation
	// camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), pitch.clampedValue.value);
	// camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), yaw.value);
	// camera.rotateOnAxis(new THREE.Vector3(0, 0, 1), roll.value);

	// Move the camera forward in the direction it is facing
	// const direction = new THREE.Vector3();
	// camera.getWorldDirection(direction);
	// camera.position.addScaledVector(direction, speed);
	// starfield.position.addScaledVector(direction, speed / 1.1);
	// / Add velocity based on key presses
	const direction = new THREE.Vector3();
	camera.getWorldDirection(direction);
	direction.normalize();

	if (keys.KeyW) velocity.add(direction.clone().multiplyScalar(0.001));
	if (keys.KeyS) velocity.add(direction.clone().multiplyScalar(-0.001));

	// const strafeDirection = new THREE.Vector3();
	// camera.getWorldDirection(strafeDirection);
	// strafeDirection.cross(camera.up);
	// strafeDirection.normalize();

	// if (keys.KeyA) camera.position.add(strafeDirection.multiplyScalar(-0.001));
	// if (keys.KeyD) camera.position.add(strafeDirection.multiplyScalar(0.001));
	// Strafe the camera left or right
	const strafeDirection = new THREE.Vector3();
	strafeDirection.crossVectors(camera.up, direction).normalize();

	if (keys.KeyA) velocity.add(strafeDirection.clone().multiplyScalar(0.001));
	if (keys.KeyD) velocity.add(strafeDirection.clone().multiplyScalar(-0.001));

	// Update camera position
	camera.position.add(velocity);
	starfield.position.add(velocity);
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
	earthMesh.rotation.y += 0.0005;
	lightMesh.rotation.y += 0.0005;

	renderer.render(scene, camera);
}

animate();
