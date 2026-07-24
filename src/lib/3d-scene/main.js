import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";
import { config, coverTexture, getTheta } from "./cardsConfig";
import { cameraConfig, sizes } from "./sceneConfig";
import { animateCards } from "./animateCards";

/**
 * ======================================== DebugUI
 */
const gui = new GUI({
  width: 340,
  title: "DEBUG UI",
  // closeFolders: true,
});
// gui.close();

const debugObject = {
  reload: () => window.location.reload(),
  setCircle: () => {
    config.type = "circle";
    // camera.position.z = cameraConfig.position.z(config.type);
    gsap.to(camera.position, {
      z: cameraConfig.position.z(config.type),
      duration: 1.5,
      ease: "power2.out",
    });
  },
  setGallery: () => {
    config.type = "gallery";
    // camera.position.z = cameraConfig.position.z(config.type);
    gsap.to(camera.position, {
      z: cameraConfig.position.z(config.type),
      duration: 1.5,
      ease: "power2.out",
    });
  },
};
gui.add(debugObject, "reload").name("Reload");
gui.add(debugObject, "setCircle").name("Make a circle");
gui.add(debugObject, "setGallery").name("Make a gallery");

/**
 * ======================================== Scene
 */
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff);

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
camera.position.x = cameraConfig.position.x;
camera.position.y = cameraConfig.position.y;
camera.position.z = cameraConfig.position.z(config.type);
scene.add(camera);

gui.add(camera.position, "z").min(0).max(10).step(0.001).name("Zoom");

/**
 * ======================================== Cards
 */
const geometry = new THREE.PlaneGeometry(config.width, config.height);
const meshesArr = [];

for (let i = 0; i < config.totalCards; i++) {
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ map: texturesArr[i] }),
  );
  scene.add(mesh);
  meshesArr.push(mesh);

  mesh.position.x = Math.sin(getTheta(i));

  if (config.type === "circle") {
    mesh.position.y = -Math.cos(getTheta(i));
  } else if (config.type === "gallery") {
    mesh.position.z = -Math.cos(getTheta(i));
  }
}

/**
 * ======================================== Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * ======================================== Raycaster
 */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
pointer.x = -1;
pointer.y = 1;

window.addEventListener("mousemove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  console.log(pointer);
});

let hoveredMeshUUID = null;
const hoverState = {};

let hoverDelayFrames = 0;
/**
 * ======================================== Animate
 */
const timer = new THREE.Timer();

const animate = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(meshesArr);

  const newHoveredUUID =
    intersects.length > 0 ? intersects[0].object.uuid : null;

  if (newHoveredUUID) {
    hoverDelayFrames = config.frames;
  } else if (hoverDelayFrames > 0) {
    hoverDelayFrames--;
  }

  const effectiveHovered =
    newHoveredUUID || (hoverDelayFrames > 0 ? hoveredMeshUUID : null);

  hoveredMeshUUID = animateCards(
    hoverState,
    hoveredMeshUUID,
    newHoveredUUID,
    effectiveHovered,
    pointer,
  );

  meshesArr.forEach((mesh, i) => {
    const offsetX = hoverState[mesh.uuid]?.x || 0;
    const offsetY = hoverState[mesh.uuid]?.y || 0;
    const goUp = hoverState[mesh.uuid]?.goUp || 0;
    const offsetRotation = hoverState[mesh.uuid]?.rotation || 0;

    mesh.rotation.y = offsetRotation;

    if (config.type === "circle") {
      mesh.position.x =
        Math.sin(getTheta(i) + elapsedTime * config.rotationSpeed) + offsetX;

      mesh.position.y =
        Math.cos(getTheta(i) + elapsedTime * config.rotationSpeed) *
          config.rotationDirection +
        offsetY;

      mesh.position.z = 0;
    } else if (config.type === "gallery") {
      mesh.position.x = Math.sin(
        getTheta(i) + elapsedTime * config.rotationSpeed,
      );

      mesh.position.y = goUp;

      mesh.position.z =
        Math.cos(getTheta(i) + elapsedTime * config.rotationSpeed) *
          config.rotationDirection +
        offsetY;
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
