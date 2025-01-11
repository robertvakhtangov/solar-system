import * as THREE from "three";

import { useEffect, useRef, useState } from "react";
import useSphere from "./hooks/useSphere";
import useOrbit from "./hooks/useOrbit";

const SIZE_NORMALIZER = 0.0001;
const EARTH_RAD = 6378 * SIZE_NORMALIZER;
const EARTH_ORBIT = 149597870 * SIZE_NORMALIZER;
const EARTH_ORBIT_TIME_SECONDS = 86400 * 365;
const MOON_RAD = 1737 * SIZE_NORMALIZER;
const MOON_ORBIT = 400000 * SIZE_NORMALIZER;
const MOON_ORBIT_TIME_SECONDS = 86400 * 27;
const SUN_RAD = 696340 * SIZE_NORMALIZER;
const TIME_SCALE = 1;

function ThreeOrbits() {
  const [cameraZoom, setCameraZoom] = useState(10);

  const refContainer = useRef(null);
  const earth = useSphere({
    sphereGeometry: { radius: EARTH_RAD },
    sphereMaterial: { color: 0x0000ff },
  });
  const earthOrbit = useOrbit({
    circleGeometry: { radius: EARTH_ORBIT, segments: 1000 },
    rotation: 90,
  });
  const moon = useSphere({
    sphereGeometry: { radius: MOON_RAD },
    sphereMaterial: { color: 0xff0000 },
  });
  const moonOrbit = useOrbit({
    circleGeometry: { radius: MOON_ORBIT },
    rotation: 90,
  });
  const sun = useSphere({
    sphereGeometry: { radius: SUN_RAD },
    sphereMaterial: { color: 0xffff00 },
  });

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  );
  camera.position.y = cameraZoom;
  camera.position.z = cameraZoom;
  camera.lookAt(0, 0, 0);

  const handleZoom = (event) => {
    console.log(event);
    setCameraZoom((curr) =>
      curr + event.deltaY < 10 ? 10 : curr + event.deltaY
    );
  };

  useEffect(() => {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (refContainer.current) {
      refContainer.current.appendChild(renderer.domElement);
    }
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    moon.position.set(MOON_ORBIT, 0, 0);
    sun.position.set(EARTH_ORBIT, 0, 0);

    const solarSystem = new THREE.Group();
    scene.add(solarSystem);
    solarSystem.add(sun);

    const earthGroup = new THREE.Group();
    earthGroup.add(moon);
    earthGroup.add(earth);
    scene.add(earthGroup);

    scene.add(moonOrbit);
    sun.add(earthOrbit);

    let animationFrameId: number;
    const animate = function (time) {
      time *= 0.001;

      earthGroup.rotation.y =
        time * TIME_SCALE * ((2 * Math.PI) / MOON_ORBIT_TIME_SECONDS);
      solarSystem.rotation.y =
        time * TIME_SCALE * ((2 * Math.PI) / EARTH_ORBIT_TIME_SECONDS);

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
    window.addEventListener("wheel", handleZoom);

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      refContainer.current.removeChild(renderer.domElement);
      window.removeEventListener("wheel", handleZoom);
      window.removeEventListener("resize", handleResize);
    };
  }, [camera]);
  return (
    <div
      ref={refContainer}
      style={{ overflow: "hidden", height: "100vh", width: "100vw" }}
    ></div>
  );
}

export default ThreeOrbits;
