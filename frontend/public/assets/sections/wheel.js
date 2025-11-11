const Wheel = () => {
  const sectionRef = React.useRef(null)

  React.useLayoutEffect(() => {
    const { gsap, ScrollTrigger, ScrollSmoother } = window
    if (!gsap || !ScrollTrigger) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const sect = sectionRef.current
      if (!sect) return
      const wheel = sect.querySelector('.wheel')
      if (!wheel) return

      const numLines = 8
      const radius = numLines * 20
      const angle = 360 / numLines

      gsap.set(wheel, { transformOrigin: '50% 50%', transformStyle: 'preserve-3d' })
      gsap.set(wheel.querySelectorAll('.wheel-text'), {
        z: radius,
        rotationX: (i) => angle * i,
        transformOrigin: `50% 50% -${radius}px`,
        backfaceVisibility: 'hidden'
      })

      const makeTrigger = () => {
        const tl = gsap.to(wheel, {
          rotationX: -360,
          ease: 'none',
          scrollTrigger: {
            trigger: sect,
            start: 'top top',
            end: '+=600',
            scrub: true,
            pin: true,
            pinSpacing: true,
            pinReparent: true,
            pinType: 'transform',
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        })

        ScrollTrigger.addEventListener('refreshInit', () => {
          gsap.set(wheel.querySelectorAll('.wheel-text'), {
            z: radius,
            transformOrigin: `50% 50% -${radius}px`
          })
        })
      }

      const afterLayoutStable = () => {
        const sm = ScrollSmoother && ScrollSmoother.get && ScrollSmoother.get()
        if (sm && sm.refresh) sm.refresh()
        requestAnimationFrame(() => {
          makeTrigger()
          requestAnimationFrame(() => ScrollTrigger.refresh(true))
        })
      }

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          requestAnimationFrame(afterLayoutStable)
        })
      } else {
        requestAnimationFrame(afterLayoutStable)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="skills full-height" ref={sectionRef}>
      <div className="wheel">
        <h2 className="wheel-text">Creative Coding</h2>
        <h2 className="wheel-text">Digital Design</h2>
        <h2 className="wheel-text">Animation</h2>
        <h2 className="wheel-text">Conceptual art</h2>
        <h2 className="wheel-text">User Experience</h2>
        <h2 className="wheel-text">Interface Design</h2>
        <h2 className="wheel-text">Behavioral Science</h2>
        <h2 className="wheel-text">Motion Design</h2>
      </div>
    </div>
  )
}

window.Wheel = Wheel
