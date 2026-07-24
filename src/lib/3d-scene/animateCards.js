import gsap from "gsap";

export function animateCards(
  hoverState,
  hoveredMeshUUID,
  newHoveredUUID,
  effectiveHovered,
  pointer,
) {
  if (effectiveHovered !== hoveredMeshUUID) {
    if (hoveredMeshUUID && hoverState[hoveredMeshUUID]) {
      gsap.to(hoverState[hoveredMeshUUID], {
        x: 0,
        y: 0,
        goUp: 0,
        rotation: 0,
        duration: 0.5,
      });
    }

    if (newHoveredUUID) {
      hoverState[newHoveredUUID] = hoverState[newHoveredUUID] || {
        x: 0,
        y: 0,
        goUp: 0,
        rotation: 0,
      };
      gsap.to(hoverState[newHoveredUUID], {
        x: pointer.x * 0.3,
        y: pointer.y * 0.2,
        goUp: 0.05,
        rotation: Math.PI * 0.2,
        duration: 0.5,
      });
    }
  }

  return effectiveHovered;
}
