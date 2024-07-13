import { useEffect, useState } from "react";

export const useInput = () => {
  // initial value for all movements. -- idle state.
  const [input, setInput] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
    jump: false,
  });

  // * These Should Start With A Capital.
  const keys = {
    KeyW: "forward",
    KeyS: "backward",
    KeyA: "left",
    KeyD: "right",
    ShiftLeft: "shift",
    Space: "jump",
  };

  // set a type that makes sure that the key value is available inside the object. ( for typescript )
  type key = keyof typeof keys;

  // This is a function that will be used to find the key value inside the object.
  const findKey = (key: key) => keys[key];

  // on each key press, find the pressed key, alter its state while keeping all other states the same, then cleanup.
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      setInput((m) => ({ ...m, [findKey(e.code)]: true }));
    };

    const handleKeyUp = (e: any) => {
      setInput((m) => ({ ...m, [findKey(e.code)]: false }));
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return input;
};
