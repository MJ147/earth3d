import * as THREE from 'three';
import { Star } from '../interfaces/star';

export class Starfield {
	private starCount: number;
	private sphereRadius = 150;
	private voidRadius = 120;
	private stars;

	constructor(starCount: number = 15000) {
		this.starCount = starCount;
		this.stars = this.createStars();
	}

	createStars(): THREE.Points {
		const starGeometry = new THREE.BufferGeometry();
		const starTexture = new THREE.TextureLoader().load('assets/star.png');
		const starMaterial = new THREE.PointsMaterial({
			vertexColors: true,
			size: 0.5,
			map: starTexture,
		});

		const starVertices = [];
		const starColors = [];

		for (let i = 0; i < this.starCount; i++) {
			const star = this.createRandomStar();

			if (star == null) continue;

			starVertices.push(...star.position);
			starColors.push(star.color, star.color, star.color);
		}

		starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
		starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

		const stars = new THREE.Points(starGeometry, starMaterial);

		return stars;
	}

	createRandomStar(): Star | null {
		const x = THREE.MathUtils.randFloatSpread(this.sphereRadius * 2);
		const y = THREE.MathUtils.randFloatSpread(this.sphereRadius * 2);
		const z = THREE.MathUtils.randFloatSpread(this.sphereRadius * 2);

		const distance = Math.sqrt(x * x + y * y + z * z);

		if (distance > this.sphereRadius || distance < this.voidRadius) return null;

		const greyValue = 0.8 + (Math.random() - 0.5) * 1;

		return { position: [x, y, z], color: greyValue };
	}

	getStars(): THREE.Points {
		return this.stars;
	}
}
