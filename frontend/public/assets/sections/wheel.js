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
      const origin = `50% 50% -${radius}px`

      gsap.set(wheel, { transformOrigin: '50% 50%' })
      gsap.set(wheel.querySelectorAll('.wheel-text'), {
        z: radius,
        rotationX: (i) => angle * i,
        transformOrigin: origin
      })

      gsap.to(wheel, {
        rotationX: -360,
        duration: 8,
        ease: 'none',
        transformOrigin: '50% 50%',
        scrollTrigger: {
          trigger: sect,
          start: 'center center',
          end: '+=600',
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          scroller: (ScrollSmoother && ScrollSmoother.get) ? (ScrollSmoother.get()?.content()) : undefined
        }
      })
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
