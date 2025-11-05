const Testamonies = () => {
  const swiperEl = React.useRef(null)
  const cache = React.useRef(new WeakMap())
  const state = React.useRef({ swiper:null, st:null })

  React.useEffect(() => {
    const { gsap } = window
    const section = document.querySelector('.testamonies')
    if (!section || !swiperEl.current || !window.Swiper || !gsap) return
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger)

    function ensureSplit(slide) {
      if (!slide) return null
      let data = cache.current.get(slide)
      if (data) return data
      const h3 = slide.querySelector('h3')
      const p = slide.querySelector('p')
      let split = null
      if (h3 && window.SplitText) split = new SplitText(h3, { type:'words' })
      const words = split ? split.words : (h3 ? [h3] : [])
      data = { h3, p, split, words, tlIn:null, tlOut:null }
      gsap.set([h3, p, ...words], { opacity: 0 })
      cache.current.set(slide, data)
      return data
    }

    function killTimelines(d) {
      d?.tlIn && d.tlIn.kill()
      d?.tlOut && d.tlOut.kill()
      if (d) { d.tlIn = null; d.tlOut = null }
    }

    function animateIn(slide) {
      const d = ensureSplit(slide)
      if (!d || !d.h3) return
      killTimelines(d)
      const tl = gsap.timeline()
      tl.to(d.h3, { opacity:1, duration:.15 })
        .fromTo(d.words, { opacity:0 }, { opacity:1, stagger:.08, duration:1, ease:'circ.in' }, 0)
      if (d.p) tl.to(d.p, { opacity:1, duration:.9, ease:'circ.in' }, .2)
      d.tlIn = tl
    }

    function animateOut(slide) {
      const d = ensureSplit(slide)
      if (!d || (!d.h3 && !d.p)) return
      killTimelines(d)
      const tl = gsap.timeline()
      if (d.p) tl.to(d.p, { opacity:0, duration:.35, ease:'circ.out' }, 0)
      tl.to(d.words.length ? d.words : d.h3, { opacity:0, duration:.4, ease:'circ.out' }, 0)
      d.tlOut = tl
    }

    const swiper = new window.Swiper(swiperEl.current, {
      loop: true,
      spaceBetween: 25,
      slidesPerView: 1,
      speed: 800,
      autoplay: { delay: 6000, disableOnInteraction: false },
      grabCursor: true,
      on: {
        init() {
          this.slides.forEach(ensureSplit)
          animateIn(this.slides[this.activeIndex])
        },
        loopFix() {
          this.slides.forEach(ensureSplit)
        },
        slideChangeTransitionStart() {
          animateOut(this.slides[this.previousIndex])
        },
        slideChangeTransitionEnd() {
          animateIn(this.slides[this.activeIndex])
        }
      }
    })

    state.current.swiper = swiper

    if (window.ScrollTrigger) {
      state.current.st = window.ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => { state.current.swiper?.autoplay?.start(); animateIn(state.current.swiper.slides[state.current.swiper.activeIndex]) },
        onEnterBack: () => { state.current.swiper?.autoplay?.start(); animateIn(state.current.swiper.slides[state.current.swiper.activeIndex]) },
        onLeave: () => { state.current.swiper?.autoplay?.stop(); animateOut(state.current.swiper.slides[state.current.swiper.activeIndex]) },
        onLeaveBack: () => { state.current.swiper?.autoplay?.stop(); animateOut(state.current.swiper.slides[state.current.swiper.activeIndex]) }
      })
    }

    const ro = new ResizeObserver(() => state.current.swiper?.update && state.current.swiper.update())
    ro.observe(section)

    return () => {
      ro.disconnect()
      state.current.st?.kill()
      state.current.swiper?.destroy(true, true)
      cache.current.forEach((v) => {
        v.tlIn?.kill()
        v.tlOut?.kill()
        v.split?.revert && v.split.revert()
      })
      cache.current = new WeakMap()
    }
  }, [])

  return (
    <div className="testamonies">
      <div className="swiper" ref={swiperEl}>
        <div className="swiper-wrapper carosuel-out">
          <div className="swiper-slide carosuel-card">
            <h3>A glimpse into my journey, ideas, processes, brain, and random thoughts.</h3>
            <p>- Seth Troxler</p>
          </div>
          <div className="swiper-slide carosuel-card">
            <h3>Don't count the days, make the days count</h3>
            <p>- Muhammad Ali</p>
          </div>
          <div className="swiper-slide carosuel-card">
            <h3>Everybody has a plan until they get punched in the mouth</h3>
            <p>- Mike Tyson</p>
          </div>
        </div>
      </div>
    </div>
  )
}

window.Testamonies = Testamonies
