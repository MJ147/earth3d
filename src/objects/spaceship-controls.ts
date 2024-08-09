import * as THREE from 'three';
import { AxisRotation } from '../interfaces/axis-rotation';
import { SteeringKey, SteeringKeys } from '../interfaces/steering-keys';

export class SpaceshipControls {
	private readonly ROTATION_STEP: number = 0.00005;
	private readonly ROTATION_LIMIT: number = 0.003;
	private readonly ACCELERATION_STEP: number = 0.0001;

	private camera: THREE.PerspectiveCamera;
	private velocity = new THREE.Vector3(0, 0, 0);
	private starfield: THREE.Points;

	private pitch: AxisRotation = {
		value: 0,
		axis: new THREE.Vector3(1, 0, 0),
	};
	private yaw: AxisRotation = {
		value: 0,
		axis: new THREE.Vector3(0, 1, 0),
	};
	private roll: AxisRotation = {
		value: 0,
		axis: new THREE.Vector3(0, 0, 1),
	};

	private keys: SteeringKeys = {
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
		Space: false,
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
		this.handleDirectionMovement(direction, this.keys.KeyW, this.keys.KeyS);

		direction.setFromMatrixColumn(this.camera.matrixWorld, 0);
		this.handleDirectionMovement(direction, this.keys.KeyD, this.keys.KeyA);

		direction.setFromMatrixColumn(this.camera.matrixWorld, 1);
		this.handleDirectionMovement(direction, this.keys.KeyR, this.keys.KeyF);

		// reduce with delay velocity on Space key to zero
		if (this.keys.Space) {
			this.velocity.multiplyScalar(0.99);
			console.log(this.velocity);
		}

		this.camera.position.add(this.velocity);
		this.starfield.position.add(this.velocity);
	}

	private rotateCamera(increase: boolean, reduce: boolean, rotation: AxisRotation) {
		if (increase && rotation.value < this.ROTATION_LIMIT) rotation.value += this.ROTATION_STEP;
		if (reduce && rotation.value > -this.ROTATION_LIMIT) rotation.value -= this.ROTATION_STEP;

		this.camera.rotateOnAxis(rotation.axis, rotation.value);
	}

	private handleDirectionMovement(direction: THREE.Vector3, increase: boolean, reduce: boolean): void {
		this.addDirectionVelocity(direction, this.ACCELERATION_STEP, increase);
		this.addDirectionVelocity(direction, -this.ACCELERATION_STEP, reduce);
	}

	private addDirectionVelocity(direction: THREE.Vector3, scalar: number, keyCondition: boolean): void {
		if (!keyCondition) return;

		this.velocity.add(direction.clone().multiplyScalar(scalar));
	}

	private handleKeyDown(event: KeyboardEvent): void {
		if (!this.keys.hasOwnProperty(event.code)) return;

		this.keys[event.code as SteeringKey] = true;
	}

	private handleKeyUp(event: any): void {
		if (!this.keys.hasOwnProperty(event.code)) return;

		this.keys[event.code as SteeringKey] = false;
	}
}
