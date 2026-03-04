import * as THREE from 'three';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

scene.add(camera);
camera.position.z = 5;


/* MESH => (shspe, material) */

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00
});

 const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

scene.add(cube);


const Light = new THREE.DirectionalLight(0xffffff, 5);
Light.position.y = 0.3;
Light.position.z = 1;
Light.position.x = 0;
scene.add(Light);


const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);



function animate() {
  renderer.render(scene, camera);
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1; 
  cube.rotation.z += 0.1;
}
  renderer.setAnimationLoop(animate);
