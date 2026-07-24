export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth / window.innerHeight,
};

export const cameraConfig = {
  angle: 40,
  aspect: sizes.aspect,
  near: 0.0001,
  far: 1000,
  position: {
    x: 0,
    y: 0,
    z: (type) => {
      if (type === "circle") {
        return 4;
      } else if (type === "gallery") {
        return 2.25;
      }
    },
  },
};
