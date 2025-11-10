import * as THREE from 'three'
import { GLTFLoader} from '../threejs-master/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from '../threejs-master/examples/jsm/controls/OrbitControls.js'
import GUI from '../threejs-master/examples/jsm/libs/lil-gui.module.min.js'

window.startMango = (mountEl) => {
    let scene, camera, renderer, controls, mango, mangoParent, starsSphere, cameraRig, params, asteroidParents, sphere
    let keyLight, fillLight, ambientLight, spotLight, spotTarget
    let textRing, textClipPlane, textGroup
    let raf = null
    let clipDist = 0
    let ringFade = 0

    let smoothCam = {
        goalPos: new THREE.Vector3(0, 0, 1),
        goalTarget: new THREE.Vector3(0, 0, 0),
        goalRoll: 0,
        posLerp: 0.12,
        targetLerp: 0.18,
        rollLerp: 0.12
    }

    init()
    animate()

    function unifyMaterials(root, {
        env = 1.2,
        rough = 0.6,
        metal = 0.0
    } = {}) {
        root.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true
                o.receiveShadow = true
                const m = o.material
                if (m) {
                    if ('envMapIntensity' in m) m.envMapIntensity = env
                    if ('roughness' in m && !m.roughnessMap) m.roughness = rough
                    if ('metalness' in m && !m.metalnessMap) m.metalness = metal
                    m.needsUpdate = true
                }
            }
        })
    }

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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
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

        smoothCam.goalPos.copy(camera.position)
        smoothCam.goalTarget.copy(controls.target)
        smoothCam.goalRoll = camera.rotation.z

        keyLight = new THREE.DirectionalLight('#4fc683', 2.38)
        keyLight.position.set(3.98, -4.66, -10)
        scene.add(keyLight)

        fillLight = new THREE.HemisphereLight('#ffffff', '#000000', 1.0)
        scene.add(fillLight)

        ambientLight = new THREE.AmbientLight('#ff8040', 1.0)
        scene.add(ambientLight)

        spotTarget = new THREE.Object3D()
        spotTarget.position.set(-0.33, 0, 0)
        scene.add(spotTarget)

        spotLight = new THREE.SpotLight('#ffffff', 25)
        spotLight.position.set(3, 1.5, -0.2)

        spotLight.target = spotTarget
        spotLight.angle = 0.5
        spotLight.penumbra = 0.3
        spotLight.decay = 2
        spotLight.distance = 0 
        spotLight.castShadow = true

        spotLight.shadow.mapSize.set(1024, 1024)
        spotLight.shadow.bias = -0.00025
        spotLight.shadow.normalBias = 0.01

        scene.add(spotLight)
        scene.add(spotLight.target)


        renderer.shadowMap.enabled = true

        cameraRig = new THREE.Object3D()
        scene.add(cameraRig)
        cameraRig.add(camera)

        params = {
            mangoSpin: true,
            mangoSpeed: 0.005,
            cameraSpin: false,
            cameraSpeed: 0.1,
            autorotate: true,
            autorotateSpeed: 0.2
        }

        const loader = new GLTFLoader()
        loader.load('./img/mango-obj/scene.gltf', (gltf) => {
            gltf.scene.updateMatrixWorld(true)
            gltf.scene.traverse((c) => {
                if (c.isMesh && !mango) {
                    mango = c
                    mango.castShadow = true
                    mango.receiveShadow = true
                }
            })
            if (!mango) return

            mango.geometry.computeBoundingBox()
            const bb = mango.geometry.boundingBox.clone()
            const center = bb.getCenter(new THREE.Vector3())
            const size = bb.getSize(new THREE.Vector3())
            mango.geometry.translate(-center.x, -center.y, -center.z)
            mango.position.set(0, 0, 0)
            mango.rotation.set(0, 0, 0)
            mango.scale.set(.9, .9, .9)
            mango.updateMatrix()

            const from = size.x >= size.y && size.x >= size.z ? new THREE.Vector3(1, 0, 0) : size.z >= size.x && size.z >= size.y ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0)
            const to = new THREE.Vector3(0, 1, 0)
            const q = new THREE.Quaternion().setFromUnitVectors(from, to)
            mango.quaternion.premultiply(q)
            mango.updateMatrix()

            const maxAniso = renderer.capabilities.getMaxAnisotropy()
            gltf.scene.traverse((c) => {
                if (c.isMesh && c.material) {
                    const m = c.material
                    ;['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'].forEach(k => {
                        if (m[k]) m[k].anisotropy = maxAniso
                    })
                }
            })

            mangoParent = new THREE.Object3D()
            mangoParent.add(mango)
            mangoParent.scale.set(0.3, 0.3, 0.3)
            mangoParent.position.set(0, 0, 0)
            mangoParent.rotation.set(Math.PI, 0, 0.28)
            scene.add(mangoParent)

            unifyMaterials(gltf.scene, { env: 1.2, rough: 0.6, metal: 0.0 })
            makeTextRing(' • CREATIVE CODING • DIGITAL DESIGN ')
        })

        asteroidParents = []
        const asteroidLoader = new GLTFLoader()
        asteroidLoader.load('./img/astroids/scene.gltf', (gltf) => {
            gltf.scene.updateMatrixWorld(true)
            const asteroids = []
            gltf.scene.traverse((c) => {
                if (c.isMesh) {
                    c.castShadow = true
                    c.receiveShadow = true
                    asteroids.push(c)
                }
            })
            if (!asteroids.length) return

            const positions = [
                new THREE.Vector3(-5, -2.54, -3.03),
                new THREE.Vector3(2.87, -0.08, -0.9),
                new THREE.Vector3(-7.95, 2.13, -3.28)
            ]

            asteroids.forEach((mesh, i) => {
                mesh.geometry.computeBoundingBox()
                const bb = mesh.geometry.boundingBox.clone()
                const center = bb.getCenter(new THREE.Vector3())
                mesh.geometry.translate(-center.x, -center.y, -center.z)
                const parent = new THREE.Object3D()
                parent.add(mesh)
                parent.scale.set(0.1, 0.1, 0.1)
                parent.position.copy(positions[i] || new THREE.Vector3())
                parent.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
                scene.add(parent)
                asteroidParents.push(parent)
            })

            unifyMaterials(gltf.scene, { env: 1.2, rough: 0.6, metal: 0.0 })
        })

        addStars()
        window.addEventListener('resize', onWindowResize)

        mangoGsap()
    }

    function makeTextRing(text = ' • CREATIVE CODING • DIGITAL DESIGN ') {
        const W = 8192, H = 512, PADY = 40, EXTRA_GAP_RATIO = 0.25
        const cvs = document.createElement('canvas')
        cvs.width = W
        cvs.height = H
        const ctx = cvs.getContext('2d')

        const tex = new THREE.CanvasTexture(cvs)
        tex.wrapS = THREE.RepeatWrapping
        tex.wrapT = THREE.ClampToEdgeWrapping
        tex.repeat.set(1, 1)
        tex.offset.set(0, 0)
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.generateMipmaps = true

        function draw() {
            ctx.clearRect(0, 0, W, H)
            const size = H - PADY * 2
            ctx.font = `700 ${size}px "Outfit", Helvetica, sans-serif`
            ctx.textBaseline = 'middle'

            const grad = ctx.createLinearGradient(0, 0, 0, H)
            grad.addColorStop(0, '#ffffff')
            grad.addColorStop(1, '#FFDCA8')
            ctx.fillStyle = grad
            ctx.shadowColor = 'rgba(255,240,200,1)'
            ctx.shadowBlur = 80

            const phrase = (text.trimEnd() + ' ').replace(/\s+$/, '  ')
            const phraseW = ctx.measureText(phrase).width
            const spacingPx = phraseW + size * EXTRA_GAP_RATIO

            let x = -spacingPx
            const y = H / 2
            while (x < W + spacingPx) {
            ctx.fillText(phrase, x, y)
            x += spacingPx
            }

            tex.userData = { spacingPx }
            tex.needsUpdate = true
        }

        draw()

        const radius = 1.58
        const height = 0.42
        const geo = new THREE.CylinderGeometry(radius, radius, height, 256, 1, true)

        const baseMat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,        // ensure opacity works
            depthWrite: false,        // avoid sorting artifacts when fading
            side: THREE.DoubleSide,
            toneMapped: false
        })

        baseMat.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying float vFacing;')
            .replace('#include <begin_vertex>', `
                #include <begin_vertex>
                vec3 n = normalize(normalMatrix * normal);
                vec3 v = normalize(-(modelViewMatrix * vec4(position,1.0)).xyz);
                vFacing = dot(n, v);
            `);
            shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nvarying float vFacing;')
            .replace('#include <map_fragment>', `
                #include <map_fragment>
                if (vFacing < 0.0) discard;
            `);
        };

        // ✅ assign to the OUTER variable
        textRing = new THREE.Mesh(geo, baseMat);

        const glowMat = baseMat.clone();
        glowMat.opacity = 0.25;
        glowMat.depthWrite = false;

        const glow = new THREE.Mesh(geo, glowMat);
        glow.scale.multiplyScalar(1.012);

        const group = new THREE.Group();
        group.rotation.x = Math.PI;
        group.position.y = 0.05;
        group.add(textRing, glow);

        // ✅ assign to the OUTER variable
        textGroup = group;

        (mangoParent || scene).add(textGroup);

        if (window.gsap) {
            const spacingPx = tex.userData.spacingPx
            const stepU = spacingPx / W         
            const speedSecsPerPhrase = 15 

            tex.offset.x = 0

            gsap.to(tex.offset, {
            x: `-=${stepU}`,
            duration: speedSecsPerPhrase,
            ease: 'none',
            repeat: -1,
            modifiers: {
                x: (v) => {
                const f = parseFloat(v)
                const wrapped = f - Math.floor(f / stepU) * stepU
                return wrapped
                }
            }
            })
        }

        textRing.updateLabel = (s) => { text = s; draw() }
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
        raf = requestAnimationFrame(animate)

        camera.position.lerp(smoothCam.goalPos, smoothCam.posLerp)
        if (controls) {
            controls.target.lerp(smoothCam.goalTarget, smoothCam.targetLerp)
            controls.update()
        } else {
            camera.lookAt(smoothCam.goalTarget)
        }
        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, smoothCam.goalRoll, smoothCam.rollLerp)

        if (mangoParent && params.mangoSpin) mangoParent.rotation.y += params.mangoSpeed
        if (textRing) textRing.rotation.y -= params.mangoSpeed

        if (textGroup && textRing) {
            const mat = textRing.material
            const glowMat = (textGroup.children[1] && textGroup.children[1].material) || null
            mat.transparent = true
            mat.depthWrite = false
            if (glowMat) { glowMat.transparent = true; glowMat.depthWrite = false }
            mat.opacity = 1 - ringFade
            if (glowMat) glowMat.opacity = 0.25 * (1 - ringFade)
            const s = 1 + 0.8 * ringFade
            textGroup.scale.set(s, s, s)
            textGroup.position.y = 0.05 - 2.0 * ringFade
            clipDist = ringFade
        }

        if (textClipPlane && mangoParent) {
            const center = new THREE.Vector3()
            mangoParent.getWorldPosition(center)
            const n = camera.position.clone().sub(center).normalize()
            const p = center.clone().add(n.clone().multiplyScalar(clipDist))
            textClipPlane.setFromNormalAndCoplanarPoint(n, p)
        }

        if (params.cameraSpin) cameraRig.rotation.y += params.cameraSpeed
        if (starsSphere) {
            starsSphere.rotation.x += 0.0004
            starsSphere.rotation.y += 0.0004
        }
        if (asteroidParents && asteroidParents.length) {
            asteroidParents.forEach((parent) => {
                parent.rotation.x += -0.006
                parent.rotation.y += -0.006
            })
        }

        renderer.render(scene, camera)
    }

    renderer.localClippingEnabled = true;

    function hideHeroText() {
        const el = document.querySelector('.story-home')
        const { gsap, ScrollTrigger } = window
        if (!el || !gsap || !ScrollTrigger) return
        gsap.registerPlugin(ScrollTrigger)

        ScrollTrigger.create({
            trigger: el,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            onUpdate: (self) => {
            ringFade = self.progress 
            }
        })
    }
    hideHeroText()

    function mangoGsap() {
        const { gsap, ScrollTrigger } = window
        if (!gsap || !ScrollTrigger) {
            return
        }
        gsap.registerPlugin(ScrollTrigger)

        const CAM = {
            scrub: 2,
            ease: 'expo.out',
            duration: 2,
            smooth: 1,
            spins: Math.PI,
            r0: 1,
            r1: 1,
            roll0: 0,
            roll1: 0,
        }

        function makeCamScroller(camera, controls) {
            return function section(cfg) {
                const el = typeof cfg.trigger === 'string' ? document.querySelector(cfg.trigger) : cfg.trigger
                if (!el) return

                const spins = cfg.spins ?? CAM.spins
                const r0 = cfg.radiusStart ?? CAM.r0
                const r1 = cfg.radiusEnd ?? CAM.r1
                const roll0 = cfg.rollStart ?? CAM.roll0
                const roll1 = cfg.rollEnd ?? CAM.roll1
                const easing = gsap.parseEase(cfg.ease || CAM.ease)
                const y0 = cfg.yStart ?? camera.position.y
                const y1 = cfg.yEnd ?? y0

                ScrollTrigger.create({
                    trigger: el,
                    start: cfg.start || 'top bottom',
                    end: cfg.end || 'bottom top',
                    scrub: cfg.scrub ?? CAM.scrub,
                    invalidateOnRefresh: true,
                    refreshPriority: cfg.priority || 1,
                    onUpdate: (self) => {
                        const t = self.progress
                        const te = easing(t)
                        const r = gsap.utils.interpolate(r0, r1, te)
                        const ang = gsap.utils.interpolate(cfg.angStart || 0, spins, t)
                        const x = Math.sin(ang) * r
                        const z = Math.cos(ang) * r
                        const y = gsap.utils.interpolate(y0, y1, t)

                        const tx = gsap.utils.interpolate(cfg.targetX0 || 0, cfg.targetX1 || 0, t)
                        const ty = gsap.utils.interpolate(cfg.targetY0 || 0, cfg.targetY1 || 0, t)
                        const tz = gsap.utils.interpolate(cfg.targetZ0 || 0, cfg.targetZ1 || 0, t)

                        smoothCam.goalPos.set(x, y, z)
                        smoothCam.goalTarget.set(tx, ty, tz)
                        smoothCam.goalRoll = gsap.utils.interpolate(roll0, roll1, t)

                        if (cfg.onProgress) cfg.onProgress(t, te)
                    }
                })
            }
        }

        const useSection = makeCamScroller(camera, controls)
        useSection({
            trigger: '.story-home',
            spins: Math.PI * 1.1,
            radiusStart: 1.0,
            radiusEnd: 1.1,
            yStart: camera.position.y,
            yEnd: camera.position.y - 0.2,
            rollStart: 1,
            rollEnd: 0.15,
            targetX0: 0,
            targetX1: 1,
            targetY0: 0.0,
            targetY1: 0.0,
            targetZ0: 0.0,
            targetZ1: 0.0,
            priority: 1
        })

        useSection({
            trigger: '.projects',
            spins: Math.PI * 0.65,
            radiusStart: 1.1,
            radiusEnd: 0.92,
            yStart: camera.position.y - 0.2,
            yEnd: camera.position.y + 0.15,
            rollStart: 0.15,
            rollEnd: -0.1,
            targetX0: 1,
            targetX1: 5,
            targetY0: 0.0,
            targetY1: 0.2,
            targetZ0: 0.0,
            targetZ1: 0.0,
            priority: 2
        })

        useSection({
            trigger: '.about-home',
            spins: Math.PI * 0.65,
            radiusStart: 0.92,
            radiusEnd: 0.5,
            yStart: camera.position.y + 0.15,
            yEnd: camera.position.y + 0.3,
            rollStart: -0.1,
            rollEnd: -0.3,
            targetX0: 5,
            targetX1: 10,
            targetY0: 0.2,
            targetY1: 2,
            targetZ0: -5,
            targetZ1: 20,
            priority: 3
        })

        useSection({
            trigger: '.blogs',
            spins: Math.PI * 0.65,
            radiusStart: 0.5,
            radiusEnd: 0.5,
            yStart: camera.position.y + 0.3,
            yEnd: camera.position.y + 0.3,
            rollStart: -0.3,
            rollEnd: -0.3,
            targetX0: 10,
            targetX1: 15,
            targetY0: 2,
            targetY1: -2,
            targetZ0: 20,
            targetZ1: 10,
            priority: 4
        })
    }

    return () => {
        if (raf) cancelAnimationFrame(raf)
        window.removeEventListener('resize', onWindowResize)
        controls?.dispose()
        renderer?.dispose()
        if (renderer?.domElement && renderer.domElement.parentNode === mountEl) {
            mountEl.removeChild(renderer.domElement)
        }
        scene?.traverse((o) => {
            if (o.geometry) o.geometry.dispose?.()
            if (o.material) {
                if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.())
                else o.material.dispose?.()
            }
        })
    }
}
