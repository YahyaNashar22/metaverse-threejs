import { useTexture } from "@react-three/drei";

const TextureSpheres = () => {
  {
    /* useTexture is used to apply the texture to the meshMaterial */
  }
  const map = useTexture("./textures/metal_plate_diff_1k.png");
  const displacementMap = useTexture("./textures/metal_plate_disp_1k.png");
  const normalMap = useTexture("./textures/metal_plate_nor_gl_1k.png");
  const roughnessMap = useTexture("./textures/metal_plate_rough_1k.png");

  return (
    <>
      <mesh scale={[0.5, 0.5, 0.5]} position={[-1, 1.5, 0]} castShadow>
        <sphereGeometry />
        <meshStandardMaterial map={map} />
      </mesh>
      <mesh scale={[0.5, 0.5, 0.5]} position={[0, 1.5, 0]} castShadow>
        <sphereGeometry />
        <meshStandardMaterial
          map={map}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
        />
      </mesh>
      {/* Each map type has its own purpose */}
      {/* The Displacement Map might cause some unwanted results, hence we added segments to the geometry for better handling, and we added displacement Scale for better output */}
      <mesh scale={[0.5, 0.5, 0.5]} position={[1, 1.5, 0]} castShadow>
        <sphereGeometry args={[1, 200, 200]} />
        <meshStandardMaterial
          map={map}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          displacementMap={displacementMap}
          displacementScale={0.05}
        />
      </mesh>
    </>
  );
};

export default TextureSpheres;
