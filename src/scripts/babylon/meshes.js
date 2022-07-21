import { MeshBuilder, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

import createScene from "./scene";

const [engine, scene] = createScene();

const addMeshes = async () => {
  // house base
  const houseBase = MeshBuilder.CreateBox("houseBase", {
    width: 2,
    height: 1.5,
    depth: 1.5,
  });
  houseBase.scaling.x = 3;
  houseBase.scaling.y = 2;
  houseBase.scaling.z = 5;

  await SceneLoader.ImportMeshAsync(
    ["ground", "track", "track-path"],
    "./scenes/",
    "munnekolala-v.0.4.gltf"
  );

  // position houses
  houseBase.position.y = scene.meshes[2].position.y;
  console.log(scene.meshes[2].position);

  engine.runRenderLoop(() => scene.render());
};

addMeshes();
