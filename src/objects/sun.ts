import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class Sun {
	private _glowGeometry = new THREE.IcosahedronGeometry(20, 12);
	private _glowMaterial = new THREE.MeshStandardMaterial({
		emissive: 0xffffdf,
		// emissiveMap: sunTexture,
		emissiveIntensity: 4,
	});

	private _sunMesh: THREE.Mesh;
	private _glowEffect: UnrealBloomPass;

	constructor() {
		this._sunMesh = this._createSun();
		this._glowEffect = this._createGlowEffect();
	}

	private _createSun(): THREE.Mesh {
		const sunMesh = new THREE.Mesh(this._glowGeometry, this._glowMaterial);
		sunMesh.position.set(-900, 300, 900);

		return sunMesh;
	}

	private _createGlowEffect(): UnrealBloomPass {
		return new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.4, 0.1, 0.1);
	}

	get sunMesh(): THREE.Mesh {
		return this._sunMesh;
	}

	get glowEffect(): UnrealBloomPass {
		return this._glowEffect;
	}
}
