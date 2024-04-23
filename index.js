import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'https://cdn.skypack.dev/tweakpane@3.1.7'

const scene = new THREE.Scene()

const pane = new Pane()
const options = {
    planeX: 0,
    planeY: 0,
    planeZ: -5
}
//Creacion del slider con un valir minimo y maximo posible
pane.addInput(options,'planeX', {
    min: -5,
    max: 5
})
pane.addInput(options,'planeY', {
    min: -5,
    max: 5
})
pane.addInput(options,'planeZ', {
    min: -5,
    max: 5
})

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//Creacion de un objeto para cargar texturas
const textureLoader = new THREE.TextureLoader()
//Cargamos la textura y la almacenamos en la constante
const texture = textureLoader.load('https://assets.codepen.io/4698468/Copper_Blue.png',() => {
    console.log('load') //CallBack que se ejecutara cuando la textura alla cargado  
})
/*
Constructor por parametros:
1. El FOV que tanto de manera vertical puede observar
2. El tamano de la camara
3. Menor alcance donde la camara renderizara
4. Mayor alcance que la camara puede renderizar 
*/
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height,1,1000)
camera.position.z = 5
scene.add(camera)
//?Funcion que recibira un Vector3 como parametro (x,y,z)
camera.lookAt(0,0,0)
const renderer = new THREE.WebGLRenderer()

const planeGeometry = new THREE.PlaneGeometry(5,5)
const planeMaterial = new THREE.MeshBasicMaterial({color: '#090'})
const plane = new THREE.Mesh(planeGeometry,planeMaterial)
plane.position.x = options.planeX
plane.position.z = -5
scene.add(plane)

renderer.setSize(sizes.width,sizes.height)
//Se agrega el canvas a nuestro documento
document.body.appendChild(renderer.domElement)
//Constructor de un objeto caja3D donde en sus parametros pide los valores de los vectores x,y,z
const cubegGeometry = new THREE.BoxGeometry(1,1,1)
/*La carga de texturas es mediante dos parametros diferentes map y matCap.
Map: Este mapeo de textura solamente plasmara tal cual es la imagen al objeto en las caras del objeto por lo
que no puede llegar a ser una buena idea si nuestra textura depende mucho del objeto general
MatCap:Buena eleccion cuando comenzamos ya que no depende de la luz, ademas se implementa mejor al Mesh
u objeto que se le aplique la textura*/
//Carga de la textura
const cubeMaterial = new THREE.MeshMatcapMaterial({matcap: texture})
const cube = new THREE.Mesh(cubegGeometry,cubeMaterial)

scene.add(cube)
renderer.setClearColor('#111')
//Debe de tener un valor entre 1 y 2
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

renderer.render(scene,camera)
//Luces
const light = new THREE.DirectionalLight(0xffffff,25)
scene.add(light)

//Helpers
const size = 10
const division = 10
const gridHelper = new THREE.GridHelper(size,division) //Crea una malla para la escena
gridHelper.position.y = -2
gridHelper.rotation.x = Math.PI*0.05
scene.add(gridHelper)

//Helper Axe (ayudante con los vectores x,y,z)
const axesHelper = new THREE.AxesHelper(5)

const helperLight = new THREE.DirectionalLightHelper(light,5)
scene.add(helperLight)

//Controls
const controls = new OrbitControls(camera,renderer.domElement)
controls.enableDamping = true
//Funcion que nos da un objeto para controlar mejor el tiempo transcurrido entre frames
const clock = new THREE.Clock()
//Funcion que se ejecutara cada frame, para crear la animacion
function animateCube() {
    //Nos va a dar el tiempo transcurrido desde que se inicia la aplicacion
    const elapsedTime = clock.getElapsedTime()
    cube.rotation.z = elapsedTime
    cube.rotation.y = elapsedTime
    //cube.position.y = Math.sin(elapsedTime)
    controls.update()
   plane.position.set(options.planeX,options.planeY,options.planeZ)
    //Cada frame que se ejecute, llamara a la funcion
    requestAnimationFrame(animateCube)
    renderer.render(scene,camera)
}
animateCube()
//Resezing o modificacion de tamano
window.addEventListener('resize',() => {
    //Actualizando los valores de renderizado a los de la ventana
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width,sizes.height)
})
//const controls = new OrbitControls(camera,renderer.domElement)

//FullScreen al canvas
window.addEventListener('dblclick',() => {
    if(!document.fullscreenElement) {
        renderer.domElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})