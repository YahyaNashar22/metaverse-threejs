import { useHelper } from "@react-three/drei";
import { useRef } from "react";

import * as THREE from "three";

type prop = {
  testing: boolean;
};

const Lights: React.FC<prop> = ({ testing }) => {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  {
    testing && useHelper(lightRef, THREE.DirectionalLightHelper, 5, "red");
  }

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        ref={lightRef}
        position={[0, 10, 10]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-near={0.1}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />
      {/* the hemisphere light is used to add realism and color bounce off objects.
      first argument is the sky color and second argument is the ground color.
      */}
      <hemisphereLight args={["#7cdbe6", "#5e9c49", 0.7]} />
    </>
  );
};

export default Lights;

// ! To activate shadows , you need to enable castShadow on the lights ( for example the directional ), then enable shadows on the canvas, and the enable receiveShadow on the mesh you want the shadow on.
