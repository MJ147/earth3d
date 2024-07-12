export interface SteeringKeys {
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

export type SteeringKey = keyof SteeringKeys;
