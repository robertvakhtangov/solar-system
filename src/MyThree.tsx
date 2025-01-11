import * as THREE from "three";

import { useEffect, useRef } from "react";

function MyThree() {
  const refContainer = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    function makeInstance(geometry, color: number, x: number) {
      const material = new THREE.MeshPhongMaterial({
        color,
        flatShading: true,
      });

      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      cube.position.x = x;

      return cube;
    }

    if (refContainer.current) {
      refContainer.current.appendChild(renderer.domElement);
    }

    const geometry = new THREE.SphereGeometry(1, 10, 10);
    // const geometry = new THREE.BoxGeometry(1, 1, 1);

    const cubes = [
      makeInstance(geometry, 0x44aa88, 0),
      makeInstance(geometry, 0x8844aa, -5),
      makeInstance(geometry, 0xaa8844, 5),
    ];
    camera.position.z = 5;

    const color = 0xfff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    let animationFrameId: number;
    const animate = function (time) {
      time *= 0.001;
      // const cube = cubes[0];

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });
      // cube.rotateOnAxis(new THREE.Vector3(0, 0, 0), 2);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      refContainer.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      ref={refContainer}
      style={{ overflow: "hidden", height: "100vh", width: "100vw" }}
    ></div>
  );
}

export default MyThree;
