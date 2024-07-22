import * as THREE from 'three';

export class Earth {
	private _earthGroup: THREE.Group = new THREE.Group();
	private _earth: THREE.Mesh;
	private _darkSide: THREE.Mesh;
	private _clouds: THREE.Mesh;

	private textureLoader = new THREE.TextureLoader();
	private earthDayTexture = this.textureLoader.load('assets/8k_earth_daymap.jpg');
	private earthNightTexture = this.textureLoader.load('assets/8k_earth_nightmap.jpg');
	private earthCloudsTexture = this.textureLoader.load('assets/8k_earth_clouds.jpg');

	private geometry = new THREE.IcosahedronGeometry(10, 12);

	constructor() {
		this._earth = this.createEarth();
		this._darkSide = this.createDarkSide();
		this._clouds = this.createClouds();

		// this._earthGroup.add(this.earth, this.darkSide, this.clouds);
		this._earthGroup.add(this.earth, this.clouds);

		this.setPosition();
	}

	private createEarth(): THREE.Mesh {
		const material = new THREE.MeshStandardMaterial({ map: this.earthDayTexture });
		const earthMesh = new THREE.Mesh(this.geometry, material);

		return earthMesh;
	}

	private createDarkSide(): THREE.Mesh {
		const material = new THREE.MeshBasicMaterial({
			map: this.earthNightTexture,
			blending: THREE.AdditiveBlending,
			transparent: false,
			opacity: 0.3,
		});
		const darkSideMesh = new THREE.Mesh(this.geometry, material);
		darkSideMesh.scale.setScalar(1.003);

		return darkSideMesh;
	}

	private createClouds(): THREE.Mesh {
		const material = new THREE.MeshStandardMaterial({
			map: this.earthCloudsTexture,
			transparent: true,
			opacity: 0.9,
			blending: THREE.AdditiveBlending,
		});
		const cloudMesh = new THREE.Mesh(this.geometry, material);
		cloudMesh.scale.setScalar(1.006);

		return cloudMesh;
	}

	private setPosition(): void {
		this.earthGroup.rotation.y = 0.5;
		this.earthGroup.rotation.z = (-23.5 * Math.PI) / 180;
	}

	get earth(): THREE.Mesh {
		return this._earth;
	}

	get darkSide(): THREE.Mesh {
		return this._darkSide;
	}

	get clouds(): THREE.Mesh {
		return this._clouds;
	}

	get earthGroup(): THREE.Group {
		return this._earthGroup;
	}
}
