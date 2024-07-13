import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useInput } from "@/hooks/useInputs";
import { useFrame, useThree } from "@react-three/fiber";

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuaternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();

// This function controls the movement diagonally for the player.
const directionOffset = ({
  forward,
  backward,
  left,
  right,
}: {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}) => {
  var directionOffset = 0; // w

  if (forward) {
    if (left) {
      directionOffset = Math.PI / 4; // w+a
    } else if (right) {
      directionOffset = -Math.PI / 4; // w+d
    }
  } else if (backward) {
    if (left) {
      directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
    } else if (right) {
      directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
    } else {
      directionOffset = Math.PI; // s
    }
  } else if (left) {
    directionOffset = Math.PI / 2; // a
  } else if (right) {
    directionOffset = -Math.PI / 2; // d
  }
  return directionOffset;
};

const MyPlayer = () => {
  const model = useGLTF("./models/player.glb");

  const { actions } = useAnimations(model.animations, model.scene);

  const { forward, backward, left, right, jump, shift } = useInput();

  const currentAction = useRef("");
  const controlsRef = useRef<typeof OrbitControls>();
  // useThree hook gives you access to all the basic objects that are kept internally, like the default renderer, scene, camera.
  const camera = useThree((state) => state.camera);

  const updateCameraTarget = (moveX: number, moveZ: number) => {
    // move camera
    camera.position.x += moveX;
    camera.position.z += moveZ;

    // update camera target
    cameraTarget.x = model.scene.position.x;
    cameraTarget.y = model.scene.position.y + 0.2; // we added the 2 for better perspective ( according to the character height ).
    cameraTarget.z = model.scene.position.z;
    if (controlsRef.current) {
      // @ts-ignore
      controlsRef.current.target = cameraTarget;
    }
  };

  model.scene.traverse((object) => {
    if (object instanceof THREE.Mesh) object.castShadow = true;
  });

  model.scene.scale.set(0.5, 0.5, 0.5);

  useEffect(() => {
    let action = "";

    if (forward || backward || left || right) {
      action = "walking";
      if (shift) {
        action = "running";
      }
    } else if (jump) {
      action = "jumping";
    } else {
      action = "idle";
    }

    // Below statement is used to switch between actions and update the reference (useRef()).
    if (currentAction.current != action) {
      const nextActionToPlay = actions[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().fadeIn(0.2).play();
      currentAction.current = action;
    }
  }, [forward, backward, left, right, jump, shift]);

  useFrame((state, delta) => {
    if (
      currentAction.current == "running" ||
      currentAction.current == "walking"
    ) {
      // calculate towards camera direction
      // * Math.atan2 is a function in JavaScript that returns the angle (in radians) between the positive x-axis and the point (x, y) in a plane.
      let angleYCameraDirection = Math.atan2(
        camera.position.x - model.scene.position.x,
        camera.position.z - model.scene.position.z
      );

      // diagonal movement angle offset
      let newDirectionOffset = directionOffset({
        forward,
        backward,
        left,
        right,
      });

      // rotate model
      rotateQuaternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + newDirectionOffset
      );
      model.scene.quaternion.rotateTowards(rotateQuaternion, 0.2);

      // calculate direction
      camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();
      walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset);

      // run/walk velocity
      const velocity = currentAction.current == "running" ? 10 : 5;

      // move model & camera
      const moveX = walkDirection.x * velocity * delta;
      const moveZ = walkDirection.z * velocity * delta;
      model.scene.position.x += moveX;
      model.scene.position.z += moveZ;
      updateCameraTarget(moveX, moveZ);
    }
  });

  return (
    <>
      {/* @ts-ignore */}
      <OrbitControls ref={controlsRef} />
      <primitive object={model.scene} />;
    </>
  );
};

export default MyPlayer;
