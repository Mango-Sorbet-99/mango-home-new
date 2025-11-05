import * as THREE from '../threejs-master/build/three.module.js'
import { GLTFLoader } from '../threejs-master/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from '../threejs-master/examples/jsm/controls/OrbitControls.js'

window.startMango = (mountEl) => {
    let scene, camera, renderer, controls, mango, mangoParent, starsSphere, cameraRig, params, asteroidParents, sphere
    let keyLight, fillLight, ambientLight, spotLight, spotTarget
    let textRing, textClipPlane, textGroup
    let raf = null
    let clipDist = 0

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

        new THREE.TextureLoader()
            .setPath('./img/')
            .load('/mango-in-space-bg-2.webp', (ldr) => {
                ldr.mapping = THREE.EquirectangularReflectionMapping
                ldr.colorSpace = THREE.SRGBColorSpace
                scene.background = ldr
                scene.environment = ldr
            })

        const {
            clientWidth: W,
            clientHeight: H
        } = mountEl
        camera = new THREE.PerspectiveCamera(100, W / H, 0.1, 1000)
        camera.position.set(0, 0, 1)

        /*const gui = new GUI({
            width: 300
        })

        const fCam = gui.addFolder('Camera')
        fCam.add(camera.position, 'x', -50, 50, 0.001).name('pos X').onChange(() => controls?.update())
        fCam.add(camera.position, 'y', -50, 50, 0.001).name('pos Y').onChange(() => controls?.update())
        fCam.add(camera.position, 'z', -50, 50, 0.001).name('pos Z').onChange(() => controls?.update())

        fCam.add(camera, 'fov', 10, 140, 0.1).name('FOV').onChange(() => camera.updateProjectionMatrix())
        fCam.add(camera, 'near', 0.01, 10, 0.01).name('Near').onChange(() => camera.updateProjectionMatrix())
        fCam.add(camera, 'far', 10, 10000, 1).name('Far').onChange(() => camera.updateProjectionMatrix())

        if (controls) {
            const fTgt = gui.addFolder('Orbit Target')
            fTgt.add(controls.target, 'x', -20, 20, 0.001).name('target X').onChange(() => controls.update())
            fTgt.add(controls.target, 'y', -20, 20, 0.001).name('target Y').onChange(() => controls.update())
            fTgt.add(controls.target, 'z', -20, 20, 0.001).name('target Z').onChange(() => controls.update())
        }
*/
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
        controls.dampingFactor = 0.05
        controls.enablePan = false
        controls.minDistance = 0.5
        controls.maxDistance = 5

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

        spotLight = new THREE.SpotLight('#ffffff', 20.0, 0.0, 0.18, 1.0, 2.0)
        spotLight.position.set(1, 2, 3)
        spotLight.target = spotTarget
        spotLight.castShadow = true
        scene.add(spotLight, spotLight.target)

        renderer.shadowMap.enabled = true

        cameraRig = new THREE.Object3D()
        scene.add(cameraRig)
        cameraRig.add(camera)

        params = {
            mangoSpin: true,
            mangoSpeed: 0.05,
            cameraSpin: false,
            cameraSpeed: 0.01,
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
            mango.scale.set(1, 1, 1)
            mango.updateMatrix()

            const from = size.x >= size.y && size.x >= size.z ? new THREE.Vector3(1, 0, 0) :
                size.z >= size.x && size.z >= size.y ? new THREE.Vector3(0, 0, 1) :
                new THREE.Vector3(0, 1, 0)
            const to = new THREE.Vector3(0, 1, 0)
            const q = new THREE.Quaternion().setFromUnitVectors(from, to)
            mango.quaternion.premultiply(q)
            mango.updateMatrix()

            const maxAniso = renderer.capabilities.getMaxAnisotropy()
            gltf.scene.traverse((c) => {
                if (c.isMesh && c.material) {
                    const m = c.material;
                    ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'].forEach(k => {
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

            unifyMaterials(gltf.scene, {
                env: 1.2,
                rough: 0.6,
                metal: 0.0
            })
            makeTextRing('CREATIVE CODING • DIGITAL DESIGN •')
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

            unifyMaterials(gltf.scene, {
                env: 1.2,
                rough: 0.6,
                metal: 0.0
            })
        })

    }

    let clipY = 0

    function makeTextRing(text = 'CREATIVE CODING • DIGITAL DESIGN •') {
        const W = 10096,
            H = 768
        const PADX = 140,
            PADY = 50

        const cvs = document.createElement('canvas')
        cvs.width = W;
        cvs.height = H
        const ctx = cvs.getContext('2d')

        const tex = new THREE.CanvasTexture(cvs)
        tex.wrapS = THREE.RepeatWrapping
        tex.wrapT = THREE.ClampToEdgeWrapping
        tex.repeat.x = -1
        tex.offset.x = 1
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter

        function draw() {
            ctx.clearRect(0, 0, W, H)
            const size = H - PADY * 2
            ctx.font = `900 ${size}px Arial Black, Helvetica, Arial, sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.save()
            ctx.shadowColor = 'rgba(255,240,200,1)'
            ctx.shadowBlur = 100
            const g = ctx.createLinearGradient(0, 0, 0, H)
            g.addColorStop(0, '#ffffff')
            g.addColorStop(1, '#FFDCA8')
            ctx.fillStyle = g
            ctx.fillText(text, W / 2, H / 2)
            ctx.restore()
            tex.needsUpdate = true
        }

        const radius = 1.58
        const height = 0.42
        const geo = new THREE.CylinderGeometry(radius, radius, height, 256, 1, true)

        textClipPlane = new THREE.Plane()
        const mat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            side: THREE.DoubleSide,
            toneMapped: false,
            clippingPlanes: [textClipPlane]
        })

        textRing = new THREE.Mesh(geo, mat)

        const glow = new THREE.Mesh(geo, mat.clone())
        glow.material.opacity = 0.25
        glow.material.depthWrite = false
        glow.material.clippingPlanes = [textClipPlane]
        glow.scale.multiplyScalar(1.012)

        textGroup = new THREE.Group()
        textGroup.rotation.x = Math.PI
        textGroup.position.y = 0.05
        textGroup.add(textRing, glow)

        if (mangoParent) mangoParent.add(textGroup)
        else scene.add(textGroup)

        draw()
        textRing.updateLabel = (s) => {
            text = s;
            draw()
        }
    }
    addStars()

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
        canvas.width = 32;
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

        if (mangoParent && params.mangoSpin) mangoParent.rotation.y += params.mangoSpeed
        if (textRing) textRing.rotation.y -= params.mangoSpeed
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
        controls.update()
        renderer.render(scene, camera)
    }

    /*GSAP*/
    function storyHomeG() {
        const storyHome = document.querySelector('.story-home');
        if (!storyHome) return;

        const {
            gsap,
            ScrollTrigger
        } = window;

        if (controls) {
            controls.target.set(0, 0, 0);
            controls.update();
        }

        const yStart = camera.position.y;
        const yEnd = yStart - .2;
        const targetX0 = 0.0;
        const targetX1 = 1;
        const spins = Math.PI * 1.1;
        const radiusStart = 1.0;
        const radiusEnd = 1.1;
        const rollStart = 0;
        const rollEnd = 0.15;

        ScrollTrigger.create({
            trigger: storyHome,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.4,
            markers: false,
            onUpdate: (self) => {
                const t = self.progress;

                const te = gsap.parseEase('expo.out')(t);
                const r = gsap.utils.interpolate(radiusStart, radiusEnd, te);
                const ang = gsap.utils.interpolate(0, spins, t);

                const x = Math.sin(ang) * r;
                const z = Math.cos(ang) * r;
                const y = gsap.utils.interpolate(yStart, yEnd, t);

                camera.position.set(x, y, z);

                const tx = gsap.utils.interpolate(targetX0, targetX1, t);
                if (controls) {
                    controls.target.set(tx, 0, 0);
                    controls.update();
                } else {
                    camera.lookAt(tx, 0, 0);
                }

                camera.rotation.z = gsap.utils.interpolate(rollStart, rollEnd, t);
            }
        });

        function moveClipPlaneOnScroll() {
            const el = document.querySelector('.story-home')
            if (!el || !window.gsap || !window.ScrollTrigger) return
            const {
                gsap,
                ScrollTrigger
            } = window
            gsap.registerPlugin(ScrollTrigger)
            ScrollTrigger.create({
                trigger: el,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.4,
                onUpdate: (self) => {
                    clipDist = gsap.utils.interpolate(0, 1, self.progress)
                }
            })
        }

        moveClipPlaneOnScroll()

        function projectsCamOnEnter() {
        const el = document.querySelector('.projects')
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: .5,
          onEnter: () => {
            const offset = new THREE.Vector3(3, 0, -3)
            const cam0 = camera.position.clone()
            const tgt0 = (controls ? controls.target : new THREE.Vector3(0,0,0)).clone()

            gsap.to({ t: 0 }, {
              t: 1,
              duration: 5,
              ease: 'expo.out',
              onUpdate: function () {
                const t = this.targets()[0].t
                const off = offset.clone().multiplyScalar(t)

                camera.position.copy(cam0).add(off)

                if (controls) {
                  controls.target.copy(tgt0).add(off)
                  controls.update()
                } else {
                  camera.lookAt(tgt0.clone().add(off))
                }

                camera.updateProjectionMatrix()
              }
            })
          }
        })
      }
      projectsCamOnEnter()

      function aboutCamOnEnter() {
        const el = document.querySelector('.about-home');
        if (!el) return;

        const offset = new THREE.Vector3(10, 0, 20);
        let cam0 = camera.position.clone();
        let tgt0 = (controls ? controls.target : new THREE.Vector3(0,0,0)).clone();
        const proxy = { t: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true,
            onRefresh: () => {
              cam0 = camera.position.clone();
              tgt0 = (controls ? controls.target : new THREE.Vector3(0,0,0)).clone();
            }
          }
        });

        tl.to(proxy, {
          t: 1,
          ease: 'none',
          onUpdate: () => {
            const off = offset.clone().multiplyScalar(proxy.t);
            camera.position.copy(cam0).add(off);
            if (controls) {
              controls.target.copy(tgt0).add(off);
              controls.update();
            } else {
              camera.lookAt(tgt0.clone().add(off));
            }
            camera.updateProjectionMatrix();
          }
        });
      }
      aboutCamOnEnter();
    }
    storyHomeG();

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