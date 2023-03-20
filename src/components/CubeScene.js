import React from "react";
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ArcRotateCamera,
  Vector4,
  Texture,
  StandardMaterial,
} from "@babylonjs/core";
import SceneComponent from "./SceneComponent";
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.

let box;

const onSceneReady = (scene, img) => {
  //   const scene = new Scene();

  const camera = new ArcRotateCamera(
    "Camera",
    -Math.PI / 2,
    Math.PI / 3,
    4
    // new Vector3.Zero()
  );
  const canvas = scene.getEngine().getRenderingCanvas();

  camera.attachControl(canvas, true);
  const light = new HemisphericLight("light", new Vector3(1, 1, 0));

  const mat = new StandardMaterial("mat");
  const texture = new Texture(
    img || "https://assets.babylonjs.com/environments/numbers.jpg"
  );
  mat.diffuseTexture = texture;

  var columns = 6;
  var rows = 1;

  const faceUV = new Array(6);

  for (let i = 0; i < 6; i++) {
    faceUV[i] = new Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
  }

  const options = {
    faceUV: faceUV,
    wrap: true,
    size: 6,
  };

  box = MeshBuilder.CreateBox("box", options);
  box.material = mat;

  // Our built-in 'ground' shape.
    // MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {
  if (box !== undefined) {

  }
};

export default function CubeScene({ img }) {
  return (
    <div
      style={{
        width: "450px",
        height: "250px",
      }}
    >
      <SceneComponent
        img={img}
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        id="my-canvas"
      />
    </div>
  );
}
