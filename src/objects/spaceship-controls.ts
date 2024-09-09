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
		const key = this.keys;
		this.rotateCamera(key.ArrowUp, key.ArrowDown, this.pitch);
		this.rotateCamera(key.ArrowLeft, key.ArrowRight, this.yaw);
		this.rotateCamera(key.KeyQ, key.KeyE, this.roll);

		const direction = new THREE.Vector3();
		this.camera.getWorldDirection(direction);
		this.handleDirectionMovement(direction, key.KeyW, key.KeyS);

		direction.setFromMatrixColumn(this.camera.matrixWorld, 0);
		this.handleDirectionMovement(direction, key.KeyD, key.KeyA);

		direction.setFromMatrixColumn(this.camera.matrixWorld, 1);
		this.handleDirectionMovement(direction, key.KeyR, key.KeyF);

		this.reduceMovement(key.Space);

		this.camera.position.add(this.velocity);
		this.starfield.position.add(this.velocity);

		this.animateCockpitMovement(
			key.KeyA || key.ArrowLeft,
			key.KeyD || key.ArrowRight,
			key.KeyR || key.ArrowUp,
			key.KeyF || key.ArrowDown,
			key.KeyW,
			key.KeyS,
			key.KeyQ,
			key.KeyE,
		);
	}

	private reduceMovement(isReduced: boolean): void {
		if (!isReduced) return;

		const movementReduceFactor = 0.99;
		const rotationReduceFactor = 0.98;

		this.velocity.multiplyScalar(movementReduceFactor);
		this.pitch.value *= rotationReduceFactor;
		this.yaw.value *= rotationReduceFactor;
		this.roll.value *= rotationReduceFactor;

		if (this.velocity.length() < 0.005) this.velocity.set(0, 0, 0);
		if (Math.abs(this.pitch.value) < 0.0001) this.pitch.value = 0;
		if (Math.abs(this.yaw.value) < 0.0001) this.yaw.value = 0;
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

	private animateCockpitMovement(
		moveLeft: boolean,
		moveRight: boolean,
		moveUp: boolean,
		moveDown: boolean,
		moveForward: boolean,
		moveBack: boolean,
		rollLeft: boolean,
		rollRight: boolean,
	): void {
		const cockpit = document.getElementById('cockpit');
		if (!cockpit) return;

		let movementX = moveLeft ? -16 : 0;
		movementX += moveRight ? 16 : 0;

		let movementY = moveUp ? -16 : 0;
		movementY += moveDown ? 16 : 0;

		let movementZ = 1;
		movementZ -= moveForward ? 0.02 : 0;
		movementZ += moveBack ? 0.02 : 0;

		let rotationZ = rollLeft ? -2 : 0;
		rotationZ += rollRight ? 2 : 0;

		cockpit.style.transform = `translate(${movementX}px, ${movementY}px) scale(${movementZ}) rotateZ(${rotationZ}deg)`;
	}

	private handleKeyDown(event: KeyboardEvent): void {
		this.toggleControlPanel(event);

		if (!this.keys.hasOwnProperty(event.code)) return;

		this.keys[event.code as SteeringKey] = true;
	}

	private handleKeyUp(event: any): void {
		if (!this.keys.hasOwnProperty(event.code)) return;

		this.keys[event.code as SteeringKey] = false;
	}

	private toggleControlPanel(event: KeyboardEvent): void {
		const controlsPanel = document.getElementById('start-screen');
		if (!controlsPanel) return;

		const isEscape = event.code === 'Escape';
		const isHidden = controlsPanel.style.visibility === 'hidden';

		controlsPanel.style.visibility = isHidden && isEscape ? 'visible' : 'hidden';
	}
}
