import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// loaders
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.hide()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// update all materials

const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true

            // child.material.roughness = 0;
            // child.material.metalness = 1;
            // child.castShadow = true
            // child.receiveShadow = true
        }

    })
}

// environment map
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

scene.background = new THREE.Color(0x7a61a3)

debugObject.envMapIntensity = 5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(() =>
{
    updateAllMaterials()
})

// models

// model mats
const materials = []
let inspirationMark
let inspirationMarkLoaded = false;

gltfLoader.load(
    '/models/im.glb',
    (gltf) =>
    {
        inspirationMark = gltf.scene
        // console.log(gltf)
        inspirationMark.scale.set(2.4, 2.4, 2.4)
        inspirationMark.position.set(-5, 3.2, 0)
        inspirationMark.rotation.y = Math.PI * 0.16
        inspirationMark.rotation.x = Math.PI * -0.05
        inspirationMark.rotation.z = Math.PI * -0.06

        // gltf.scene.getObjectByName('Cube001').material.color.setHex(0x00FF00)

        materials.back = inspirationMark.getObjectByName('Cube001')
        materials.front = inspirationMark.getObjectByName('Cube001_1')
        materials.left = inspirationMark.getObjectByName('Cube001_2')
        materials.right = inspirationMark.getObjectByName('Cube001_3')
        materials.top = inspirationMark.getObjectByName('Cube001_4')
        materials.bottom = inspirationMark.getObjectByName('Cube001_5')

        materials.back.material.color.setHex(0x75b09c)
        materials.front.material.color.setHex(0x0a47ed)
        materials.left.material.color.setHex(0x643a71)
        materials.right.material.color.setHex(0xe661b2)
        materials.top.material.color.setHex(0xaf3b6e)
        materials.bottom.material.color.setHex(0xdb6c79)

        scene.add(inspirationMark)

        gui.add(inspirationMark.rotation, 'y')
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.001)
            .name('rotation')

        updateAllMaterials()

        inspirationMarkLoaded = true;

    }
)


// // lights

// const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
// directionalLight.position.set(0.25, 3, -2.25)
// scene.add(directionalLight)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.normalBias = 0.05

// gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
// gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
// gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
// gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')

/**
 * Sizes
 */
const sizes = {
    width: 1920,//window.innerWidth,
    height: 1080//window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    // sizes.width = window.innerWidth
    // sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.OrthographicCamera(sizes.width / - 300, sizes.width / 300, sizes.height / 300, sizes.height / - 300, 0.1, 1000);
// const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000);

camera.position.set(0, 0, - 20)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    preserveDrawingBuffer: true
})
renderer.setSize(sizes.width / 2, sizes.height / 2)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setPixelRatio(2)

var button = document.getElementById('save-button');
var colourButton = document.getElementById('colour-button');

button.onclick = function ()
{
    // // window.open(renderer.domElement.toDataURL('image/png'), 'screenshot');
    // const dataURL = renderer.domElement.toDataURL('image/png');
    // button.href = dataURL;
    // button.download = 'export.png';

    var a = document.createElement('a');
    a.href = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
    a.download = 'WT_graphic.png'
    a.click();
}

const colours = [
    0x0a47ed,
    0x410099,
    0x643a71,
    0xaf3b6e,
    0xdb6c79,
    0xe661b2,
    0xec4e20,
    0xff760c,
    0xffe330,
    0x75b09c,
    0x00d1d9,
    0x005377
]

function shuffle(array)
{
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0)
    {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

colourButton.onclick = function ()
{
    shuffle(colours)
    materials.back.material.color.setHex(colours[0])
    materials.front.material.color.setHex(colours[1])
    materials.left.material.color.setHex(colours[2])
    materials.right.material.color.setHex(colours[3])
    materials.top.material.color.setHex(colours[4])
    materials.bottom.material.color.setHex(colours[5])

    scene.background = new THREE.Color(colours[6])

    document.body.style.backgroundColor = '#' + colours[6].toString(16).padStart(6, '0') + "80"
    console.log(colours[6].toString(16))
}







// renderer.physicallyCorrectLights = true
// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 3
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

// gui.add(renderer, 'toneMapping', {
//     No: THREE.NoToneMapping,
//     Linear: THREE.LinearToneMapping,
//     Reinhard: THREE.ReinhardToneMapping,
//     Cineon: THREE.CineonToneMapping,
//     ACESFilmic: THREE.ACESFilmicToneMapping
// })

// gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Animate
 */

var clock = new THREE.Clock();
clock.start()

const tick = () =>
{
    // Update controls
    controls.update()

    const time = Date.now() * 0.001;

    // // animation
    // if (inspirationMarkLoaded)
    // {
    //     inspirationMark.rotation.y += Math.sin(time) * 0.001

    //     inspirationMark.position.x += Math.sin(time * 0.4) * 0.01
    //     inspirationMark.position.y += Math.sin(time * 0.3) * 0.01
    //     // console.log(clock.elapsedTime)
    // }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
