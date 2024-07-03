import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();

const w = window.innerWidth;
const h = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
});

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

function animate() {
	requestAnimationFrame(animate);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera);
}

animate();
