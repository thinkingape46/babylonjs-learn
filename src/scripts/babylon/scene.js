import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

// import lake from "../../scenes/mnklal_lake.glb"

const createScene = () => {
  const canvas = document.getElementById("canvas");

  const engine = new Engine(canvas, true);

  const scene = new Scene(engine);
  const camera = new ArcRotateCamera(
    "camera1",
    Math.PI / 2,
    Math.PI / 2,
    2,
    new Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);
  camera.setTarget(Vector3.Zero());
  // eslint-disable-next-line no-new
  new HemisphericLight("light", new Vector3(1, 1, 0));

  return [engine, scene];
};

export default createScene;
