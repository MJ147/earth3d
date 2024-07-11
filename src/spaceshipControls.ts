import * as THREE from 'three';

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

export class SpaceshipControls {
	camera: THREE.PerspectiveCamera;
	velocity = new THREE.Vector3(0, 0, 0);
	starfield: THREE.Points;

	pitch: AxisRotation = {
		clampedValue: { value: 0, step: 0.00005, min: -0.003, max: 0.003 },
		axis: new THREE.Vector3(1, 0, 0),
	};
	yaw: AxisRotation = {
		clampedValue: { value: 0, step: 0.00005, min: -0.003, max: 0.003 },
		axis: new THREE.Vector3(0, 1, 0),
	};
	roll: AxisRotation = {
		clampedValue: { value: 0, step: 0.00005, min: -0.003, max: 0.003 },
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

	rotateCamera(increase: boolean, reduce: boolean, { axis, clampedValue }: AxisRotation) {
		if (increase && clampedValue.value < clampedValue.max) clampedValue.value += clampedValue.step;
		if (reduce && clampedValue.value > clampedValue.min) clampedValue.value -= clampedValue.step;

		this.camera.rotateOnAxis(axis, clampedValue.value);
	}

	addDirectionVelocity(direction: THREE.Vector3, scalar: number, keyCondition: boolean): void {
		if (keyCondition) {
			this.velocity.add(direction.clone().multiplyScalar(scalar));
		}
	}

	handleDirectionMovement(
		direction: THREE.Vector3,
		scalar: number,
		positiveKey: keyof SteeringKeys,
		negativeKey: keyof SteeringKeys,
	): void {
		this.addDirectionVelocity(direction, scalar, this.keys[positiveKey]);
		this.addDirectionVelocity(direction, -scalar, this.keys[negativeKey]);
	}

	updateCamera(): void {
		this.rotateCamera(this.keys.KeyR, this.keys.KeyF, this.pitch);
		this.rotateCamera(this.keys.ArrowLeft, this.keys.ArrowRight, this.yaw);
		this.rotateCamera(this.keys.KeyQ, this.keys.KeyE, this.roll);

		const direction = new THREE.Vector3();
		this.camera.getWorldDirection(direction);
		this.handleDirectionMovement(direction, 0.0001, 'ArrowUp', 'ArrowDown');

		direction.setFromMatrixColumn(this.camera.matrixWorld, 0);
		this.handleDirectionMovement(direction, 0.0001, 'KeyD', 'KeyA');

		direction.setFromMatrixColumn(this.camera.matrixWorld, 1);
		this.handleDirectionMovement(direction, 0.0001, 'KeyW', 'KeyS');

		this.camera.position.add(this.velocity);
		this.starfield.position.add(this.velocity);
	}

	handleKeyDown(event: KeyboardEvent): void {
		console.log(this.keys);

		if (this.keys.hasOwnProperty(event.code)) {
			this.keys[event.code as keyof SteeringKeys] = true;
		}
	}

	handleKeyUp(event: any): void {
		if (this.keys.hasOwnProperty(event.code)) {
			this.keys[event.code as keyof SteeringKeys] = false;
		}
	}
}
