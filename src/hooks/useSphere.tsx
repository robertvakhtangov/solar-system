import * as THREE from "three";

type sphereParams = {
  sphereGeometry: {
    radius: number;
    widthSegments?: number;
    heightSegments?: number;
  };
  sphereMaterial: {
    color: number;
    flatShading?: boolean;
  };
};

function useSphere({ sphereGeometry, sphereMaterial }: sphereParams) {
  const geometry = new THREE.SphereGeometry(
    sphereGeometry.radius,
    sphereGeometry.widthSegments || 10,
    sphereGeometry.heightSegments || 10
  );

  const material = new THREE.MeshPhongMaterial({
    color: sphereMaterial.color,
    flatShading: sphereMaterial.flatShading || true,
    // emissive: 0xffffff,
  });

  const sphere = new THREE.Mesh(geometry, material);

  return sphere;
}

export default useSphere;
