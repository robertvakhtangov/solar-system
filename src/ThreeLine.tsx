import * as THREE from "three";

import { useEffect, useRef } from "react";

function ThreeLine() {
  const refContainer = useRef(null);
  useEffect(() => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (refContainer.current) {
      refContainer.current.appendChild(renderer.domElement);
    }

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);

    scene.add(line);
    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
      refContainer.current.removeChild(renderer.domElement);
    };
  }, []);
  return (
    <div
      ref={refContainer}
      style={{ overflow: "hidden", height: "100vh", width: "100vw" }}
    ></div>
  );
}

export default ThreeLine;
