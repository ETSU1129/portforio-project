import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// /**
//  * Spector JS
//  */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()

/**
 * Base//
 */
// Debug
const gui = new GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked34.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// // Portal light material
// const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

// // Pole light material
// const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

/**
 * Model
 */
gltfLoader.load(
    'mattya2.glb',
    (gltf) =>
    {   
        // const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
        // const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')
        // const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
        // const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')
        gltf.scene.traverse((child)=>
        {
            child.material = bakedMaterial
        })

        
        // bakedMesh.material = bakedMaterial
        // portalLightMesh.material = portalLightMaterial
        // poleLightAMesh.material = poleLightMaterial
        // poleLightBMesh.material = poleLightMaterial

        scene.add(gltf.scene)
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 0.5
camera.position.z = -0.8
const initialTarget = new THREE.Vector3(-0.5, 0.3, 0)
camera.lookAt(initialTarget)



// Controls

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.copy(initialTarget);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

const overlayDiv = document.createElement('div');
overlayDiv.id = 'overlay';
overlayDiv.innerHTML = '<h1>Welcome to<br>     my Portfolio!</h1>';
document.body.appendChild(overlayDiv);

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();