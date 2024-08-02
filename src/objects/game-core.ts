import * as THREE from 'three';
import { Earth } from './earth';
import { Starfield } from './starfield';
import { Sun } from './sun';
import { SpaceshipControls } from './spaceship-controls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

export class GameCore {
	camera: THREE.PerspectiveCamera;
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;

	constructor() {
		this.camera = this.createCamera();
		this.scene = this.createScene();
		this.renderer = this.createRenderer();
		this.setWindowResizeListener();
	}

	createCamera() {
		const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.rotation.order = 'YXZ';
		camera.position.z = 50;
		camera.position.y = 20;
		camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -0.36);

		return camera;
	}

	createScene() {
		const scene = new THREE.Scene();
		// const earth = new Earth();
		// scene.add(earth.earthGroup);

		// const starfield = new Starfield();
		// scene.add(starfield.getStars());

		// const sunlight = new THREE.DirectionalLight(0xffffff, 1);
		// sunlight.position.set(-2, 0.5, 1.5);
		// scene.add(sunlight);

		// const sun = new Sun();
		// scene.add(sun.sunMesh);

		return scene;
	}

	createRenderer() {
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		return renderer;
	}

	setWindowResizeListener(): void {
		const w = window.innerWidth;
		const h = window.innerHeight;

		window.addEventListener('resize', () => {
			this.camera.aspect = w / h;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(w, h);
		});
	}

	createComposer(): void {
		const composer = new EffectComposer(this.renderer);
		const renderScene = new RenderPass(this.scene, this.camera);
		composer.addPass(renderScene);
	}

	animate(): void {
		const spaceShipControls = new SpaceshipControls(this.camera, starfield.getStars());

		requestAnimationFrame(animate);
		spaceShipControls.updateCamera();
		earth.earth.rotation.y += earth.earthRotationStep;
		earth.darkSide.rotation.y += earth.earthRotationStep;
		earth.clouds.rotation.y += earth.earthRotationStep + 0.00002;

		renderer.render(scene, camera);
		composer.render();
	}
}
