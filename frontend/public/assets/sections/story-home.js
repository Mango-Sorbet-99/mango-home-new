const { useEffect, useRef, useState } = React

;(function () {
  const StoryHome = () => {
    const h2Ref = useRef(null)
    const splitRef = useRef(null)
    const tlsRef = useRef([])
    const [story, setStory] = useState('')

    useEffect(() => {
      let alive = true
      const url = (window.API_URL || '') + '/api/home'
      fetch(url)
        .then((r) => r.json())
        .then((j) => {
          if (!alive) return
          setStory(j?.data?.story || '')
        })
        .catch((e) => console.error('Strapi fetch error:', e))
      return () => { alive = false }
    }, [])

    useEffect(() => {
      if (!story || !h2Ref.current) return
      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger
      const SplitText = window.SplitText

      if (!gsap || !ScrollTrigger || !SplitText) return

      splitRef.current = new SplitText(h2Ref.current, { type: 'words' })
      const words = splitRef.current.words || []

      tlsRef.current = words.map((word) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: word,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.5,
          },
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
    }, [story])

    return (
      <div className="story-home">
        <h2 ref={h2Ref}>{story}</h2>
        <div className="button-1 button glass btn-animate">
          <div className="LED"></div>
          <p>Want to know more, visit the about page</p>
        </div>
      </div>
    )
  }

  window.StoryHome = StoryHome
})()
