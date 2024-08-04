import * as THREE from 'three';
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

export class GameCore {
	private _camera: THREE.PerspectiveCamera;
	private _scene: THREE.Scene;
	private _renderer: THREE.WebGLRenderer;
	private _composer: EffectComposer;

	constructor() {
		this._camera = this._createCamera();
		this._scene = this._createScene();
		this._renderer = this._createRenderer();
		this._composer = this._createComposer();
		this._setWindowResizeListener();
	}

	private _createCamera() {
		const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.rotation.order = 'YXZ';
		camera.position.z = 50;
		camera.position.y = 20;
		camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -0.36);

		return camera;
	}

	private _createScene() {
		const scene = new THREE.Scene();

		return scene;
	}

	private _createRenderer() {
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		return renderer;
	}

	private _createComposer(): EffectComposer {
		const composer = new EffectComposer(this._renderer);
		const renderScene = new RenderPass(this._scene, this._camera);
		composer.addPass(renderScene);

		return composer;
	}

	private _setWindowResizeListener(): void {
		const w = window.innerWidth;
		const h = window.innerHeight;

		window.addEventListener('resize', () => {
			this._camera.aspect = w / h;
			this._camera.updateProjectionMatrix();
			this._renderer.setSize(w, h);
		});
	}

	addToScene(...object: THREE.Object3D[]): void {
		this._scene.add(...object);
	}

	addToComposer(pass: Pass): void {
		this._composer.addPass(pass);
	}

	get scene(): THREE.Scene {
		return this._scene;
	}

	get camera(): THREE.PerspectiveCamera {
		return this._camera;
	}

	get renderer(): THREE.WebGLRenderer {
		return this._renderer;
	}

	get composer(): EffectComposer {
		return this._composer;
	}
}
