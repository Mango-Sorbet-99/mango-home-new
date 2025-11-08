import * as THREE from '../threejs-master/build/three.module.js'
import { OrbitControls } from '../threejs-master/examples/jsm/controls/OrbitControls.js'

window.startSpace = (mountEl) => {
  let scene, camera, renderer, controls, starsGroup, raf = null
  let lastProgress = null, progAccum = 0, nudging = false, lastNudgeAt = 0

  const smoothCam = {
    goalPos: new THREE.Vector3(0, 0, 1),
    goalTarget: new THREE.Vector3(0, 0, 0),
    goalRoll: 0,
    posLerp: 0.12,
    targetLerp: 0.18,
    rollLerp: 0.12
  }

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

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
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

    addStars()
    window.addEventListener('resize', onWindowResize)

    introAndIdle()
    setupScrollNudger()
  }

  function addStars() {
    const total = 750
    const sets = 3
    starsGroup = new THREE.Group()
    const base = Math.floor(total / sets)
    const remainder = total % sets
    for (let i = 0; i < sets; i++) {
      const count = base + (i < remainder ? 1 : 0)
      const geom = new THREE.BufferGeometry()
      const mat = new THREE.PointsMaterial({
        size: 4,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        map: makeStarTexture(i + 1)
      })
      const verts = new Float32Array(count * 3)
      for (let j = 0; j < count; j++) {
        const idx = j * 3
        verts[idx] = (Math.random() - 0.5) * 3000
        verts[idx + 1] = (Math.random() - 0.5) * 3000
        verts[idx + 2] = (Math.random() - 0.5) * 3000
      }
      geom.setAttribute('position', new THREE.BufferAttribute(verts, 3))
      const stars = new THREE.Points(geom, mat)
      starsGroup.add(stars)
    }
    scene.add(starsGroup)
  }

  function makeStarTexture(type) {
    const cvs = document.createElement('canvas')
    cvs.width = 32
    cvs.height = 32
    const ctx = cvs.getContext('2d')
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    if (type === 1) {
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.2, 'rgba(200,255,255,1)')
      g.addColorStop(0.4, 'rgba(0,0,124,1)')
      g.addColorStop(1, 'rgba(0,0,0,1)')
    } else if (type === 2) {
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.2, 'rgba(241,220,202,1)')
      g.addColorStop(0.4, 'rgba(239,120,23,1)')
      g.addColorStop(1, 'rgba(0,0,0,1)')
    } else {
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.2, 'rgba(255,255,255,1)')
      g.addColorStop(0.4, 'rgba(192,247,216,1)')
      g.addColorStop(1, 'rgba(0,0,0,1)')
    }
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 32, 32)
    const tex = new THREE.Texture(cvs)
    tex.needsUpdate = true
    return tex
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
    controls.target.lerp(smoothCam.goalTarget, smoothCam.targetLerp)
    controls.update()
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, smoothCam.goalRoll, smoothCam.rollLerp)
    if (starsGroup) {
      starsGroup.rotation.x += 0.0004
      starsGroup.rotation.y += 0.0004
    }
    renderer.render(scene, camera)
  }

  function introAndIdle() {
    const { gsap } = window
    if (!gsap) return
    gsap.to(smoothCam.goalPos, { z: 0.9, duration: 1.6, ease: 'power2.out' })
    gsap.to(smoothCam.goalTarget, { y: 0.02, duration: 1.6, ease: 'power2.out' })
    gsap.to(smoothCam.goalPos, { x: '+=0.06', y: '+=0.03', duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gsap.to(smoothCam.goalTarget, { x: '+=0.03', y: '+=0.02', duration: 7.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
  }

  function setupScrollNudger() {
    const { gsap, ScrollTrigger } = window
    if (!gsap || !ScrollTrigger) return
    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: 'max',
      scrub: true,
      onUpdate: (self) => {
        const now = performance.now()
        if (lastProgress == null) lastProgress = self.progress
        const dp = Math.abs(self.progress - lastProgress)
        lastProgress = self.progress
        progAccum += dp
        if (!nudging && progAccum >= 0.6 && now - lastNudgeAt > 1200) {
          progAccum = 0
          nudgeCamera()
        }
      }
    })
  }

  function nudgeCamera() {
    const { gsap } = window
    if (!gsap || nudging) return
    nudging = true

    const axes = ['x', 'y', 'z'].sort(() => Math.random() - 0.5)
    const count = 1 + Math.floor(Math.random() * 3)
    const picks = axes.slice(0, count)

    const toPos = {}
    const toTgt = {}

    picks.forEach(a => {
      const sgn = Math.random() < 0.5 ? -1 : 1
      const dp = a === 'z' ? 0.06 : 0.8
      const dt = a === 'z' ? 0.04 : 0.5
      toPos[a] = `+=${sgn * (dp * (0.6 + Math.random() * 0.8))}`
      toTgt[a] = `+=${sgn * (dt * (0.5 + Math.random() * 2.0))}`
    })

    const roll = THREE.MathUtils.lerp(-0.25, 0.25, Math.random())

    const tl = gsap.timeline({
      onComplete: () => {
        nudging = false
        lastNudgeAt = performance.now()
        clampRadius()
      }
    })
    tl.to(smoothCam.goalPos, { ...toPos, duration: 1.2, ease: 'expo.out' }, 0)
    tl.to(smoothCam.goalTarget, { ...toTgt, duration: 1.2, ease: 'expo.out' }, 0)
    tl.to(smoothCam, { goalRoll: roll, duration: 1.2, ease: 'expo.out' }, 0)
  }

  function clampRadius() {
    const r = smoothCam.goalPos.length()
    const rMin = 0.6, rMax = 1.4
    if (r < rMin || r > rMax) {
      const s = THREE.MathUtils.clamp(r, rMin, rMax) / (r || 1)
      smoothCam.goalPos.multiplyScalar(s)
    }
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
