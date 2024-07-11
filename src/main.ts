import './style.css';
import * as THREE from 'three';
import { getStarfield } from './starfield.ts';

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

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

interface ClampedValue {
	value: number;
	step: number;
	min: number;
	max: number;
}

interface AxisRotation {
	clampedValue: ClampedValue;
	axis: THREE.Vector3;
}

interface SteeringKeys {
	ArrowUp: boolean; // move forward
	ArrowDown: boolean; // move backward
	ArrowLeft: boolean; // rotate left
	ArrowRight: boolean; // rotate right
	KeyA: boolean; // move left
	KeyD: boolean; // move right
	KeyW: boolean; // move up
	KeyS: boolean; // move down
	KeyQ: boolean; // roll left
	KeyE: boolean; // roll right
	KeyR: boolean; // roll forward
	KeyF: boolean; // roll backward
}

let pitch: AxisRotation = {
	clampedValue: { value: 0, step: 0.00005, min: -0.003, max: 0.003 },
	axis: new THREE.Vector3(1, 0, 0),
};
let yaw: AxisRotation = {
	clampedValue: { value: 0, step: 0.00005, min: -0.003, max: 0.003 },
	axis: new THREE.Vector3(0, 1, 0),
};
let roll: AxisRotation = {
	clampedValue: { value: 0, step: 0.00005, min: -0.003, max: 0.003 },
	axis: new THREE.Vector3(0, 0, 1),
};
// let speed = 0;
const velocity = new THREE.Vector3(0, 0, 0);

const keys: SteeringKeys = {
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
	KeyR: false,
	KeyF: false,
};

function rotateCamera(increase: boolean, reduce: boolean, { axis, clampedValue }: AxisRotation) {
	if (increase && clampedValue.value < clampedValue.max) clampedValue.value += clampedValue.step;
	if (reduce && clampedValue.value > clampedValue.min) clampedValue.value -= clampedValue.step;

	camera.rotateOnAxis(axis, clampedValue.value);
}

function addDirectionVelocity(direction: THREE.Vector3, scalar: number, keyCondition: boolean): void {
	if (keyCondition) {
		velocity.add(direction.clone().multiplyScalar(scalar));
	}
}

function handleDirectionMovement(
	direction: THREE.Vector3,
	scalar: number,
	positiveKey: keyof SteeringKeys,
	negativeKey: keyof SteeringKeys,
): void {
	addDirectionVelocity(direction, scalar, keys[positiveKey]);
	addDirectionVelocity(direction, -scalar, keys[negativeKey]);
}

function updateCamera(): void {
	rotateCamera(keys.KeyR, keys.KeyF, pitch);
	rotateCamera(keys.ArrowLeft, keys.ArrowRight, yaw);
	rotateCamera(keys.KeyQ, keys.KeyE, roll);

	const direction = new THREE.Vector3();
	camera.getWorldDirection(direction);
	handleDirectionMovement(direction, 0.0001, 'ArrowUp', 'ArrowDown');

	direction.setFromMatrixColumn(camera.matrixWorld, 0);
	handleDirectionMovement(direction, 0.0001, 'KeyD', 'KeyA');

	direction.setFromMatrixColumn(camera.matrixWorld, 1);
	handleDirectionMovement(direction, 0.0001, 'KeyW', 'KeyS');

	camera.position.add(velocity);
	starfield.position.add(velocity);
}

// Event listeners for keydown and keyup
function handleKeyDown(event: KeyboardEvent) {
	if (keys.hasOwnProperty(event.code)) {
		keys[event.code as keyof SteeringKeys] = true;
	}
}

function handleKeyUp(event: any) {
	if (keys.hasOwnProperty(event.code)) {
		keys[event.code as keyof SteeringKeys] = false;
	}
}

function animate() {
	requestAnimationFrame(animate);
	updateCamera();
	earthMesh.rotation.y += earthRotationStep;
	lightMesh.rotation.y += earthRotationStep;

	renderer.render(scene, camera);
}

animate();
