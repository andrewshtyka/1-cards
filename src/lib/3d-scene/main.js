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
import { config, coverTexture, getTheta } from "./cardsConfig";
import { cameraConfig, sizes } from "./sceneConfig";

/**
 * ======================================== Scene
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

/**
 * ======================================== Textures
 */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const texturesArr = [];

[...Array(config.totalCards)].forEach((item, i) => {
  const texture = textureLoader.load(`/images/${i + 1}.webp`, (current) => {
    coverTexture(current);
  });
  texture.colorSpace = THREE.SRGBColorSpace;
  texturesArr.push(texture);
});

/**
 * ======================================== Canvas
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * ======================================== Sizes
 */

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
const camera = new THREE.PerspectiveCamera(
  cameraConfig.angle,
  cameraConfig.aspect,
  cameraConfig.near,
  cameraConfig.far,
);
camera.position.z = cameraConfig.position.z;
scene.add(camera);

/**
 * ======================================== Cards
 */
const geometry = new THREE.PlaneGeometry(config.width, config.height);

const meshesArr = [];

for (let i = 0; i < config.totalCards; i++) {
  const planeMesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ map: texturesArr[i] }),
  );
  scene.add(planeMesh);
  meshesArr.push(planeMesh);

  planeMesh.position.x = Math.sin(getTheta(i));
  planeMesh.position.y = -Math.cos(getTheta(i));
}

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

  meshesArr.forEach((mesh, i) => {
    mesh.position.x = Math.sin(
      getTheta(i) + elapsedTime * config.rotationSpeed,
    );
    mesh.position.y =
      Math.cos(getTheta(i) + elapsedTime * config.rotationSpeed) *
      config.rotationDirection;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
