import * as THREE from "three";

const cardSize = 3.5;

export const config = {
  height: cardSize / 9,
  width: cardSize / 12,

  totalCards: 16,
  angleSpread: Math.PI * 2,
  rotationSpeed: 0.15,
  rotationDirection: 1,

  frames: 60,
  type: "gallery", // circle | gallery
};

export function getTheta(i) {
  return config.angleSpread + config.angleSpread * (i / config.totalCards);
}

export function coverTexture(texture) {
  const imgAspect = texture.image.width / texture.image.height;
  const planeAspect = config.width / config.height;

  if (imgAspect > planeAspect) {
    // img wider? cut sides
    const scale = planeAspect / imgAspect;
    texture.repeat.set(scale, 1);
    texture.offset.set((1 - scale) * 0.5, 0);
  } else {
    // img higher? cut top and bottom
    const scale = imgAspect / planeAspect;
    texture.repeat.set(1, scale);
    texture.offset.set(0, (1 - scale) * 0.5);
  }

  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
}
