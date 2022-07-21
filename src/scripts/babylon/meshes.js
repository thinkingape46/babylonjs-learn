import {
  MeshBuilder,
  SceneLoader,
  StandardMaterial,
  Color3,
  Texture,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

import createScene from "./scene";

const [engine, scene] = createScene();

const addMeshes = async () => {
  // house base
  const houseBase = MeshBuilder.CreateBox("houseBase", {
    width: 1,
    height: 1,
    depth: 1,
  });
  const houseRoof = MeshBuilder.CreateCylinder("houseRoof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  houseRoof.rotation.z = Math.PI / 2;

  await SceneLoader.ImportMeshAsync(
    ["ground", "track", "track-path"],
    "./scenes/",
    "munnekolala-v.0.5.gltf"
  );

  const ground = scene.meshes.filter((m) => m.name === "ground")[0];
  const track = scene.meshes.filter((m) => m.name === "track")[0];

  // position houses
  houseRoof.scaling.y = 1.22;
  houseRoof.scaling.x = 0.75;
  //   houseBase.position.y = ground.position.y;
  houseRoof.position.y = +0.75;

  // materials
  const groundMaterial = new StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseColor = new Color3(0, 1, 0);
  const concreteMaterial = new StandardMaterial("concreteMaterial", scene);
  concreteMaterial.diffuseColor = new Color3(0.48, 0.48, 0.44);
  const roofMaterial = new StandardMaterial("roofMaterial", scene);
  roofMaterial.diffuseTexture = new Texture("./images/roof-texture.jpg", scene);
  const wallMaterial = new StandardMaterial("wallMaterial", scene);
  wallMaterial.diffuseTexture = new Texture(
    "./images/floor-texture.png",
    scene
  );

  // Assign materials
  ground.material = groundMaterial;
  track.material = concreteMaterial;
  houseRoof.material = roofMaterial;
  houseBase.material = wallMaterial;

  console.log(ground.position.y);

  engine.runRenderLoop(() => scene.render());
};

addMeshes();
