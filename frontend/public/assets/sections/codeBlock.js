const CodeBlock = () => {
  const root = React.useRef(null)
  React.useEffect(() => {
    const { gsap, ScrollTrigger } = window
    if (!gsap || !ScrollTrigger || !root.current) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const imgs = root.current.querySelectorAll('img')
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'top 45%',
          toggleActions: 'play none none reverse',
        }
      }).fromTo(imgs, {
        opacity: 0,
      },{
        opacity: 1,
        duration: 1.5,
        ease: 'expo.in',
        stagger: 0.3
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="codeBlox">
      <img src="./img/CodeBlock.webp" />
      <img src="./img/CodeBlock-1.webp" />
      <img src="./img/CodeBlock-2.webp" />
    </div>
  )
}

window.CodeBlock = CodeBlock