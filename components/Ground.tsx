import { useHelper } from "@react-three/drei";
import { useRef } from "react";

import * as THREE from "three";

const Ground: React.FC = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  useHelper(lightRef, THREE.DirectionalLightHelper, 5, "red");

  return (
    <>
      <mesh rotation-x={Math.PI * -0.5} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#458745" />
      </mesh>
    </>
  );
};

export default Ground;
