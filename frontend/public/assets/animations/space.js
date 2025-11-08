import * as THREE from '../threejs-master/build/three.module.js'
import {OrbitControls} from '../threejs-master/examples/jsm/controls/OrbitControls.js'

window.startMango = (mountEl) => {
    let scene, camera, renderer, controls, starsSphere, cameraRig
    let keyLight, fillLight, ambientLight, spotLight, spotTarget
    init()
    animate()
    function init() {
        scene = new THREE.Scene()

        new THREE.TextureLoader().setPath('./img/').load('/mango-in-space-bg-2.webp', (ldr) => {
            ldr.mapping = THREE.EquirectangularReflectionMapping
            ldr.colorSpace = THREE.SRGBColorSpace
            scene.background = ldr
            scene.environment = ldr
        })

        const { clientWidth: W, clientHeight: H } = mountEl
        camera = new THREE.PerspectiveCamera(100, W / H, 0.1, 1000)
        camera.position.set(0, 0, 1)

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(W, H)
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.0
        renderer.physicallyCorrectLights = true
        renderer.localClippingEnabled = true
        mountEl.appendChild(renderer.domElement)

        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 1
        controls.enablePan = false
        controls.minDistance = 0.5
        controls.maxDistance = 5
        controls.target.set(0, 0, 0)
        controls.update()

        keyLight = new THREE.DirectionalLight('#4fc683', 2.38)
        keyLight.position.set(3.98, -4.66, -10)
        scene.add(keyLight)

        fillLight = new THREE.HemisphereLight('#ffffff', '#000000', 1.0)
        scene.add(fillLight)

        ambientLight = new THREE.AmbientLight('#ff8040', 1.0)
        scene.add(ambientLight)

        spotTarget = new THREE.Object3D()
        spotTarget.position.set(0, 0, 0)
        scene.add(spotTarget)

        spotLight = new THREE.SpotLight('#ffffff', 20.0, 0.18, 0.18, 1.0, 2.0)
        spotLight.position.set(1, 2, 3)
        spotLight.target = spotTarget
        spotLight.castShadow = true
        scene.add(spotLight, spotLight.target)

        renderer.shadowMap.enabled = true

        cameraRig = new THREE.Object3D()
        scene.add(cameraRig)
        cameraRig.add(camera)

        addStars()
        window.addEventListener('resize', onWindowResize)
    }

    function addStars() {
        const totalStars = 750
        const sets = 3
        starsSphere = new THREE.Group()
        const base = Math.floor(totalStars / sets)
        const remainder = totalStars % sets
        for (let i = 0; i < sets; i++) {
            const count = base + (i < remainder ? 1 : 0)
            const starsGeometry = new THREE.BufferGeometry()
            const starsMaterial = new THREE.PointsMaterial({
                size: 4,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthTest: true,
                depthWrite: false,
                map: getTexture(i + 1)
            })
            const verts = new Float32Array(count * 3)
            for (let j = 0; j < count; j++) {
                const idx = j * 3
                verts[idx] = (Math.random() - 0.5) * 3000
                verts[idx + 1] = (Math.random() - 0.5) * 3000
                verts[idx + 2] = (Math.random() - 0.5) * 3000
            }
            starsGeometry.setAttribute('position', new THREE.BufferAttribute(verts, 3))
            const stars = new THREE.Points(starsGeometry, starsMaterial)
            starsSphere.add(stars)
        }
        scene.add(starsSphere)
    }

    function getTexture(type) {
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        const context = canvas.getContext('2d')
        let gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16)
        if (type === 1) {
            gradient.addColorStop(0, 'rgba(255,255,255,1)')
            gradient.addColorStop(0.2, 'rgba(200,255,255,1)')
            gradient.addColorStop(0.4, 'rgba(0,0,124,1)')
            gradient.addColorStop(1, 'rgba(0,0,0,1)')
        } else if (type === 2) {
            gradient.addColorStop(0, 'rgba(255,255,255,1)')
            gradient.addColorStop(0.2, 'rgba(241,220,202,1)')
            gradient.addColorStop(0.4, 'rgba(239,120,23,1)')
            gradient.addColorStop(1, 'rgba(0,0,0,1)')
        } else {
            gradient.addColorStop(0, 'rgba(255,255,255,1)')
            gradient.addColorStop(0.2, 'rgba(255,255,255,1)')
            gradient.addColorStop(0.4, 'rgba(192,247,216,1)')
            gradient.addColorStop(1, 'rgba(0,0,0,1)')
        }
        context.fillStyle = gradient
        context.fillRect(0, 0, 32, 32)
        const texture = new THREE.Texture(canvas)
        texture.needsUpdate = true
        return texture
    }

    function onWindowResize() {
        const w = mountEl.clientWidth
        const h = mountEl.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
    }

    function animate() {
        if (starsSphere) {
            starsSphere.rotation.x += 0.0004
            starsSphere.rotation.y += 0.0004
        }
        renderer.render(scene, camera)
    }
}
