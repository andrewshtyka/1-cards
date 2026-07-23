/**
 * ======================================== Plan
 *
 * BASE
 * 1. Create full screen canvas +
 * 2. Create scene +
 * 3. Create camera +
 * 4. Create renderer +
 * 5. Create animation function +
 *
 * OBJECTS
 * 1. Create card (mesh)
 * 2. Create 10 meshes in circle
 * 3. Add texture to each card
 *
 * ANIMATION
 * 1. On hover card rotates around Y and goes up
 * 2. Cards rotate around the circle
 */

import * as THREE from "three";

/**
 * ======================================== Scene
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

/**
 * ======================================== Canvas
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * ======================================== Sizes
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth / window.innerHeight,
};

window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.aspect = sizes.width / sizes.height;

  // update camera
  camera.aspect = sizes.aspect;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);

  // update pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * ======================================== Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.aspect, 1, 1000);
camera.position.z = 4;
scene.add(camera);

/**
 * ======================================== Plane
 */

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1.25),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
scene.add(planeMesh);

/**
 * ======================================== Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * ======================================== Animate
 */
const timer = new THREE.Timer();

const animate = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  planeMesh.position.y = Math.sin(elapsedTime * 2) * 0.1;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
