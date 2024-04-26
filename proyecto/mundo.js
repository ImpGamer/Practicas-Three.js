import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const latLngToVec3 = (radius, lat, lng) => {
  return new THREE.Vector3().setFromSphericalCoords(
    radius,
    THREE.MathUtils.degToRad(90 - lat), // nuestra textura esta girada
    THREE.MathUtils.degToRad(90 + lng)
  );
};

const markers = [
  {
    name: "Villarrica",
    lat: -39,
    lng: -71
  },
  {
    name: "Maracay",
    lat: 10,
    lng: -67
  }
];

const mouse = {
  x: 0,
  y: 0
};

// CAMERA

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 5;
const cameraGroup = new THREE.Group();
cameraGroup.add(camera);
scene.add(cameraGroup);

// RESIZE

window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // update camera
  camera.aspect = sizes.width / sizes.height;

  camera.updateProjectionMatrix();
  // update renderer
  renderer.setSize(sizes.width, sizes.height);
});

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / sizes.width - 0.5;
  mouse.y = -1 * (event.clientY / sizes.height - 0.5);
});

// TEXTURES

const textureLoader = new THREE.TextureLoader();
const planetColor = textureLoader.load(
  "https://assets.codepen.io/4698468/2k_earth_daymap.jpg"
);
const planetNormals = textureLoader.load(
  "https://assets.codepen.io/4698468/8k_earth_normal_map_compress.jpg"
);
const cloudsAlpha = textureLoader.load(
  "https://assets.codepen.io/4698468/2k_earth_clouds.jpg"
);
const planetAo = textureLoader.load(
  "https://assets.codepen.io/4698468/2k_earth_specular_map.jpg"
);
// MESH

const planetGeometry = new THREE.SphereGeometry(1, 60);
const planetMaterial = new THREE.MeshStandardMaterial({
  map: planetColor,
  normalMap: planetNormals,
  aoMap: planetAo
});
planetMaterial.aoMapIntensity = 0.5;
planetMaterial.normalScale = new THREE.Vector2(10, 10);
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

const cloudsGeometry = new THREE.SphereGeometry(1.01, 60);
const cloudsMaterial = new THREE.MeshStandardMaterial({
  alphaMap: cloudsAlpha,
  transparent: true
});

planetMaterial.normalScale = new THREE.Vector2(10, 10);
const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
scene.add(clouds);

const groupMarkers = new THREE.Group();
const markersGeometry = new THREE.SphereGeometry(0.02, 16);
const markersMaterial = new THREE.MeshBasicMaterial({ color: "#fff" });
markers.map((marker) => {
  const markerMesh = new THREE.Mesh(markersGeometry, markersMaterial);
  markerMesh.name = marker.name;
  const position = latLngToVec3(1, marker.lat, marker.lng);
  markerMesh.position.set(...position);
  console.log(markerMesh);
  groupMarkers.add(markerMesh);
});
scene.add(groupMarkers);

// LIGHT
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 2, 4);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// RENDER

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor("#111");
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// CONTROLS
const control = new OrbitControls(camera, renderer.domElement);
control.enablePan = false;
control.enableZoom = false;

// LOOP
const clock = new THREE.Clock();
function animate(time) {
  const elapseTime = clock.getElapsedTime();

  planet.rotation.y = elapseTime * (0.025 + 0.025);
  groupMarkers.rotation.y = elapseTime * (0.025 + 0.025);
  clouds.rotation.y = elapseTime * (0.05 + 0.025);

  //mouse effect
  cameraGroup.position.x += (mouse.x - cameraGroup.position.x) * 0.05;
  cameraGroup.position.y += (mouse.y - cameraGroup.position.y) * 0.05;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
