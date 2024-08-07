import * as THREE from 'three';

export class Earth {
	private _earthGroup: THREE.Group = new THREE.Group();
	private _earth: THREE.Mesh;
	private _darkSide: THREE.Mesh;
	private _clouds: THREE.Mesh;

	private _textureLoader = new THREE.TextureLoader();
	private _earthDayTexture = this._textureLoader.load('assets/8k_earth_daymap.jpg');
	private _earthNightTexture = this._textureLoader.load('assets/8k_earth_nightmap.jpg');
	private _earthCloudsTexture = this._textureLoader.load('assets/8k_earth_clouds.jpg');

	private _geometry = new THREE.IcosahedronGeometry(10, 12);
	private _earthRotationStep: number = 0.0001;

	constructor(earthRotationStep: number = 0.0001) {
		this._earthRotationStep = earthRotationStep;
		this._earth = this.createEarth();
		this._darkSide = this.createDarkSide();
		this._clouds = this.createClouds();

		// this._earthGroup.add(this.earth, this.darkSide, this.clouds);
		this._earthGroup.add(this.earth, this.clouds);

		this.setPosition();
	}

	private createEarth(): THREE.Mesh {
		const sunlight = new THREE.DirectionalLight(0xffffff, 1);
		sunlight.position.set(-2, 0.5, 1.5);
		const material = new THREE.ShaderMaterial({
			uniforms: {
				texture1: { value: this._earthDayTexture },
				texture2: { value: this._earthNightTexture },
				directionalLightDirection: { value: new THREE.Vector3(-1, -1, -1).normalize() },
				directionalLightColor: { value: new THREE.Color(0xffffff) },
			},
			vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vLightDirection;

                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vLightDirection = normalize(directionalLightDirection);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
			fragmentShader: `
                uniform sampler2D texture1;
                uniform sampler2D texture2;
                uniform vec3 directionalLightDirection;
                uniform vec3 directionalLightColor;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vLightDirection;

                void main() {
                    vec4 color1 = texture2D(texture1, vUv);
                    vec4 color2 = texture2D(texture2, vUv);
                    vec4 color = mix(color2, color1, step(0.5, vUv.x));

                    // // Simple diffuse lighting calculation
                    // float diffuse = max(dot(vNormal, -vLightDirection), 0.0);
                    // vec3 lighting = directionalLightColor * diffuse;

                    // Output the final color
                    gl_FragColor = color;
                `,
			// lights: true,
		});

		// map: this._earthDayTexture,
		const earthMesh = new THREE.Mesh(this._geometry, material);

		return earthMesh;
	}

	private createDarkSide(): THREE.Mesh {
		const material = new THREE.MeshBasicMaterial({
			map: this._earthNightTexture,
			blending: THREE.AdditiveBlending,
			transparent: false,
			opacity: 0.3,
		});
		const darkSideMesh = new THREE.Mesh(this._geometry, material);
		darkSideMesh.scale.setScalar(1.003);

		return darkSideMesh;
	}

	private createClouds(): THREE.Mesh {
		const material = new THREE.MeshStandardMaterial({
			map: this._earthCloudsTexture,
			transparent: true,
			opacity: 0.9,
			blending: THREE.AdditiveBlending,
		});
		const cloudMesh = new THREE.Mesh(this._geometry, material);
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

	get earthRotationStep(): number {
		return this._earthRotationStep;
	}
}
