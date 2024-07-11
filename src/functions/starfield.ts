import * as THREE from 'three';

export function getStarfield(starCount: number = 15000): THREE.Points {
	const sphereRadius = 150; // Radius of the star sphere
	const voidRadius = 120; // Radius of the empty space
	const starGeometry = new THREE.BufferGeometry();
	const starTexture = new THREE.TextureLoader().load('assets/star.png');
	const starMaterial = new THREE.PointsMaterial({
		vertexColors: true,
		size: 0.5,
		map: starTexture,
	});

	const starVertices = [];
	const starColors = [];

	for (let i = 0; i < starCount; i++) {
		const x = THREE.MathUtils.randFloatSpread(sphereRadius * 2);
		const y = THREE.MathUtils.randFloatSpread(sphereRadius * 2);
		const z = THREE.MathUtils.randFloatSpread(sphereRadius * 2);

		const distance = Math.sqrt(x * x + y * y + z * z);
		if (distance > sphereRadius || distance < voidRadius) continue;

		starVertices.push(x, y, z);
		const greyValue = 0.8 + (Math.random() - 0.5) * 1;
		starColors.push(greyValue, greyValue, greyValue);
	}

	starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
	starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

	const stars = new THREE.Points(starGeometry, starMaterial);

	return stars;
}
