"use client";

import "./globalStyles.css";

import { Canvas } from "@react-three/fiber";
import { NextPage } from "next";
import { OrbitControls, Stats } from "@react-three/drei";

import Lights from "@/components/Lights";
import Ground from "@/components/Ground";

import Tree from "@/components/Trees";
import MyPlayer from "@/components/Player";

const Home: NextPage = () => {
  const testing = false;
  return (
    <div className="container">
      <Canvas shadows>
        {/* Stats to show  FPS */}
        {testing ? <Stats /> : null}
        {/* Shows x,y,z axis */}
        {testing ? <axesHelper args={[2]} /> : null}
        {/* Shows main plane as grid */}
        {testing ? <gridHelper args={[10, 10]} /> : null}
        <OrbitControls />
        <Lights testing={testing} />
        <Ground />
        <Tree boundary={1000} count={30} testing={testing} />
        <MyPlayer />
      </Canvas>
    </div>
  );
};

export default Home;
