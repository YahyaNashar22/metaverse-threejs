import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useHelper } from "@react-three/drei";

type Props = {
  isTesting: boolean;
};

const AnimationBox: React.FC<Props> = ({ isTesting }) => {
  // useRef is used to control and modify the properties of existing element.
  const meshRef = useRef<THREE.Mesh>(null!);

  // useHelper takes the ref, helper type and color and provides the helper for the referenced geometry.
  {
    isTesting ? useHelper(meshRef, THREE.BoxHelper, "blue") : null;
  }

  // useFrame hook is used to make the animation.
  // useFrame can only be called inside Canvas element.
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.x += 0.01;
  });
  return (
    <mesh ref={meshRef} scale={[0.5, 0.5, 0.5]}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
};

export default AnimationBox;
