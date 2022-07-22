import {
  MeshBuilder,
  SceneLoader,
  StandardMaterial,
  Color3,
  Texture,
  Vector4,
  Mesh,
  Vector3,
  AxesViewer,
  CreateCylinder,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import earcut from "earcut";

import createScene from "./scene";

const [engine, scene] = createScene();

// axis
const axes = new AxesViewer(scene, 1);

const addMeshes = async () => {
  // house base
  const faceUV = [];
  faceUV[0] = new Vector4(0.0, 0.0, 0.25, 1);
  faceUV[1] = new Vector4(0.25, 0.0, 0.5, 1);
  faceUV[2] = new Vector4(0.5, 0.0, 0.75, 1);
  faceUV[3] = new Vector4(0.75, 0.0, 1, 1);
  const houseBase = MeshBuilder.CreateBox("houseBase", {
    width: 1,
    height: 1,
    depth: 1,
    faceUV: faceUV,
    wrap: true,
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
    "munnekolala-v.0.6.gltf"
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
    "./images/cubehouse-texture.png",
    scene
  );

  // Assign materials
  ground.material = groundMaterial;
  track.material = concreteMaterial;
  houseRoof.material = roofMaterial;
  houseBase.material = wallMaterial;

  // merge meshes
  const house = Mesh.MergeMeshes(
    [houseBase, houseRoof],
    true,
    false,
    null,
    false,
    true
  );

  // scaling the house
  house.position.x = 6;
  house.position.z = 6;
  house.scalingDeterminant = 3;

  // building a car
  const carOutline = [new Vector3(0, 0, 0), new Vector3(2, 0, 0)];

  const carMirrorOutlinePoints = 60;
  for (let i = 45; i <= carMirrorOutlinePoints; i++) {
    carOutline.push(
      new Vector3(
        2 - Math.sin(Math.PI * (i / 30)),
        0,
        Math.cos(Math.PI * ((carMirrorOutlinePoints - i) / 30))
      )
    );
  }
  carOutline.push(new Vector3(0, 0, Math.cos(0)));
  carOutline.push(new Vector3(0, 0, 0));

  const car = new MeshBuilder.ExtrudePolygon(
    "car",
    {
      shape: carOutline,
      depth: 1,
    },
    scene,
    earcut
  );

  car.scalingDeterminant = 1;
  house.computeWorldMatrix(true);
  car.computeWorldMatrix(true);

  // building wheels
  const wheelLF = new CreateCylinder("wheelLF", {
    diameter: 0.5,
    height: 0.1,
  });
  wheelLF.parent = car;
  wheelLF.position.x = 2.5;
  wheelLF.position.y = -1;

  const wheelRF = wheelLF.clone("wheelRF");
  wheelRF.position.y = 0;

  const wheelLB = wheelLF.clone("wheelLB");
  wheelLB.position.x = 1;

  const wheelRB = wheelLF.clone("wheelRB");
  wheelRB.position.x = 1;
  wheelRB.position.y = 0;

  car.rotation.x = -Math.PI / 2;

  console.log(135, wheelRF);

  // setting axes
  axes.xAxis.parent = car;
  axes.yAxis.parent = car;
  axes.zAxis.parent = car;

  engine.runRenderLoop(() => scene.render());
};

addMeshes();
