export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth / window.innerHeight,
};

export const cameraConfig = {
  angle: 40,
  aspect: sizes.aspect,
  near: 1,
  far: 1000,
  position: {
    z: 4,
  },
};
