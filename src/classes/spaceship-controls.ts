import * as THREE from 'three';
import { AxisRotation } from '../interfaces/axis-rotation';
import { SteeringKey, SteeringKeys } from '../interfaces/steering-keys';

export class SpaceshipControls {
	readonly ROTATION_STEP: number = 0.00005;
	readonly ROTATION_LIMIT: number = 0.003;
	readonly ACCELERATION_STEP: number = 0.0001;

	camera: THREE.PerspectiveCamera;
	velocity = new THREE.Vector3(0, 0, 0);
	starfield: THREE.Points;

	pitch: AxisRotation = {
		value: 0,
		axis: new THREE.Vector3(1, 0, 0),
	};
	yaw: AxisRotation = {
		value: 0,
		axis: new THREE.Vector3(0, 1, 0),
	};
	roll: AxisRotation = {
		value: 0,
		axis: new THREE.Vector3(0, 0, 1),
	};

	keys: SteeringKeys = {
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

	constructor(camera: THREE.PerspectiveCamera, starfield: THREE.Points) {
		this.starfield = starfield;
		this.camera = camera;
		window.addEventListener('keydown', (event: KeyboardEvent): void => this.handleKeyDown(event));
		window.addEventListener('keyup', (event: KeyboardEvent): void => this.handleKeyUp(event));
	}

	updateCamera(): void {
		this.rotateCamera(this.keys.ArrowUp, this.keys.ArrowDown, this.pitch);
		this.rotateCamera(this.keys.ArrowLeft, this.keys.ArrowRight, this.yaw);
		this.rotateCamera(this.keys.KeyQ, this.keys.KeyE, this.roll);

		const direction = new THREE.Vector3();
		this.camera.getWorldDirection(direction);
		this.handleDirectionMovement(direction, this.keys.KeyR, this.keys.KeyF);

		direction.setFromMatrixColumn(this.camera.matrixWorld, 0);
		this.handleDirectionMovement(direction, this.keys.KeyD, this.keys.KeyA);

		direction.setFromMatrixColumn(this.camera.matrixWorld, 1);
		this.handleDirectionMovement(direction, this.keys.KeyW, this.keys.KeyS);

		this.camera.position.add(this.velocity);
		this.starfield.position.add(this.velocity);
	}

	rotateCamera(increase: boolean, reduce: boolean, rotation: AxisRotation) {
		if (increase && rotation.value < this.ROTATION_LIMIT) rotation.value += this.ROTATION_STEP;
		if (reduce && rotation.value > -this.ROTATION_LIMIT) rotation.value -= this.ROTATION_STEP;

		this.camera.rotateOnAxis(rotation.axis, rotation.value);
	}

	handleDirectionMovement(direction: THREE.Vector3, increase: boolean, reduce: boolean): void {
		this.addDirectionVelocity(direction, this.ACCELERATION_STEP, increase);
		this.addDirectionVelocity(direction, -this.ACCELERATION_STEP, reduce);
	}

	addDirectionVelocity(direction: THREE.Vector3, scalar: number, keyCondition: boolean): void {
		if (!keyCondition) return;

		this.velocity.add(direction.clone().multiplyScalar(scalar));
	}

	handleKeyDown(event: KeyboardEvent): void {
		if (!this.keys.hasOwnProperty(event.code)) return;

		this.keys[event.code as SteeringKey] = true;
	}

	handleKeyUp(event: any): void {
		if (!this.keys.hasOwnProperty(event.code)) return;

		this.keys[event.code as SteeringKey] = false;
	}
}
