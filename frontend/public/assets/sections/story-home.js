const StoryHome = () => {
  const h2Ref = React.useRef(null)
  const splitRef = React.useRef(null)
  const tlsRef = React.useRef([])

  React.useEffect(() => {
    const storyEl = h2Ref.current
    if (!storyEl || !window.gsap || !window.SplitText) return

    const { gsap, SplitText } = window

    splitRef.current = new SplitText(storyEl, { type: 'words' })
    const words = splitRef.current.words || []

    tlsRef.current = words.map((word) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: word,
          start: 'top bottom',
          end: 'top center',
          scrub: 0.5
        }
      })
      tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'expo.in' })
      return tl
    })

    return () => {
      tlsRef.current.forEach((tl) => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill()
        tl.kill()
      })
      tlsRef.current = []

      if (splitRef.current) {
        splitRef.current.revert()
        splitRef.current = null
      }
    }
  }, [])

  return (
    <div className="story-home">
      <h2 ref={h2Ref}>
        I am a creative coder, designer, + artist, with over a decade of experience
        working at the intersection of technology + creativity.
      </h2>

      <div className="button-1 button glass btn-animate">
        <div className="LED"></div>
        <p>Want to know more, visit the about page</p>
      </div>
    </div>
  )
}

window.StoryHome = StoryHome
