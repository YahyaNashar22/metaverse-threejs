import * as THREE from "three";

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useEffect, useState } from "react";

type prop = {
  boundary: number;
  count: number;
  testing: boolean;
};

type treeType = {
  position: { x: number; z: number };
  box: number;
};

const Trees: React.FC<prop> = ({ boundary, count, testing }) => {
  const model = useLoader(GLTFLoader, "./models/maple_tree/scene.gltf");

  const [trees, setTrees] = useState<treeType[]>([]);

  // traverse method , iterates through all the children of the object.
  model.scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
    }
  });

  // These are all the different scenarios of trees overlapping.
  const boxIntersect = (
    minAx: number,
    minAz: number,
    maxAx: number,
    maxAz: number,
    minBx: number,
    minBz: number,
    maxBx: number,
    maxBz: number
  ) => {
    let aLeftOfB = maxAx < minBx;
    let aRightOfB = minAx > maxBx;
    let aAboveB = minAz > maxBz;
    let aBelowB = maxAz < minBz;

    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
  };

  // This function makes sure there will be no overlapping trees.
  // Takes the index of the tree ( or any unique identifier value ), the tree object that will be placed and the trees array that it wants to traverse.
  const isOverLapping = (index: number, tree: any, trees: any[]) => {
    // * The min and max values are to determine the boundaries of each tree.
    const minTargetX = tree.position.x - tree.box / 2;
    const maxTargetX = tree.position.x + tree.box / 2;
    const minTargetZ = tree.position.z - tree.box / 2;
    const maxTargetZ = tree.position.z + tree.box / 2;

    for (let i = 0; i < index; i++) {
      let minChildX = trees[i].position.x - trees[i].box / 2;
      let maxChildX = trees[i].position.x + trees[i].box / 2;
      let minChildZ = trees[i].position.z - trees[i].box / 2;
      let maxChildZ = trees[i].position.z + trees[i].box / 2;

      if (
        boxIntersect(
          minTargetX,
          minTargetZ,
          maxTargetX,
          maxTargetZ,
          minChildX,
          minChildZ,
          maxChildX,
          maxChildZ
        )
      ) {
        console.log("Content box overlapping", tree.position);
        return true;
      }
    }
    return false;
  };

  // This function sets a position for the tree inside the selected boundary.
  const newPosition = (box: number, boundary: number) => {
    return (
      boundary / 2 -
      box / 2 -
      (boundary - box) * (Math.round(Math.random() * 100) / 100)
    );
  };

  // This function spreads the trees across the map inside selected boundary.
  const updatePosition = (treeArray: treeType[], boundary: number) => {
    treeArray.forEach((tree, index) => {
      // Create a new position each time it overlaps.
      do {
        tree.position.x = newPosition(tree.box, boundary);
        tree.position.z = newPosition(tree.box, boundary);
      } while (isOverLapping(index, tree, treeArray));
    });
    setTrees(treeArray);
  };

  useEffect(() => {
    const tempTree: treeType[] = [];
    for (let i = 0; i < count; i++) {
      tempTree.push({ position: { x: 0, z: 0 }, box: 12 });
    }
    updatePosition(tempTree, boundary);
  }, [boundary, count]);

  return (
    <>
      {/* Object3D is added so we can interact with the object attributes ( position, rotation, etc...) */}
      {/* model.scene is a reference object, hence we use clone() to make multiple 'clones' of it. */}
      {/* 
      <object3D position={[-2, 0, 0]} >
        <primitive object={model.scene.clone()} />
      </object3D>

      However we can replace object3D by directly placing the primitive inside the group.

      */}

      <group scale={[0.02, 0.02, 0.02]}>
        {trees.map((tree, index) => {
          return (
            <object3D
              key={index}
              position={[tree.position.x, 0, tree.position.z]}
            >
              <mesh scale={[tree.box, tree.box, tree.box]} visible={testing}>
                <boxGeometry />
                <meshBasicMaterial color={"blue"} wireframe />
              </mesh>
              <primitive object={model.scene.clone()} />
            </object3D>
          );
        })}
      </group>
    </>
  );

  // * The <primitive> component in React Three Fiber is used to render Three.js objects that do not have a direct React Three Fiber component equivalent. The object prop of the <primitive> component allows you to pass any Three.js object directly to it.

  // * <primitive>: This is a special component in React Three Fiber that can take any Three.js object and render it within the Three.js scene managed by React Three Fiber.

  // * object={model.scene}: This passes the root scene object of the GLTF model to the <primitive> component. The scene contains all the meshes and other objects that are part of the model.
};

export default Trees;

// ! This component is made by loading a gltf model manually.
// ! Can Be replaced by the terminal command gltfjsx <model>.
// ! The Difference is this is a model. The one created by the command is a jsx component and it gives better access.
