import * as THREE from "three";

type orbitParams = {
  circleGeometry: {
    radius: number;
    segments?: number;
  };
  rotation: number;
};

function useOrbit({ circleGeometry, rotation }: orbitParams) {
  const geometry = new THREE.CircleGeometry(
    circleGeometry.radius,
    circleGeometry.segments || 64
  );

  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x949494 });
  const edges = new THREE.EdgesGeometry(geometry);
  const circleEdges = new THREE.LineSegments(edges, edgesMaterial);
  circleEdges.rotateX((rotation * Math.PI) / 180);
  return circleEdges;
}

export default useOrbit;
