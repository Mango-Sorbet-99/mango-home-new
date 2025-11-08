const Testamonies = () => {
  const swiperEl = React.useRef(null)
  const wrapperRef = React.useRef(null)
  const cache = React.useRef(new WeakMap())
  const state = React.useRef({ swiper:null, st:null, ro:null })

  React.useEffect(() => {
    const { gsap } = window
    const section = document.querySelector('.testamonies')
    if (!section || !swiperEl.current || !gsap) return
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger)

    const fetchJSON =
      window.fetchJSON ||
      (path =>
        fetch((window.API_URL || '') + path).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.json()
        }))

    function ensureSplit(slide) {
      if (!slide) return null
      let data = cache.current.get(slide)
      if (data) return data
      const h3 = slide.querySelector('h3')
      const p = slide.querySelector('p')
      let split = null
      if (h3 && window.SplitText) split = new SplitText(h3, { type:'words' })
      const words = split ? split.words : (h3 ? [h3] : [])
      const d = { h3, p, split, words, tlIn:null, tlOut:null }
      gsap.set([h3, p, ...words], { opacity: 0 })
      cache.current.set(slide, d)
      return d
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

    fetchJSON('/api/section?populate[testimonials]=*')
      .then(j => {
        const items =
          Array.isArray(j?.data?.testimonials) ? j.data.testimonials :
          Array.isArray(j?.data?.attributes?.testimonials) ? j.data.attributes.testimonials :
          []

        console.log('Loaded testimonials:', items)

        if (!wrapperRef.current) return
        wrapperRef.current.innerHTML = ''

        items.forEach(t => {
          const text = t?.testimonial || ''
          const name = t?.name || ''
          if (!text) return

          const slide = document.createElement('div')
          slide.className = 'swiper-slide carosuel-card'

          const h3 = document.createElement('h3')
          h3.textContent = text

          const p = document.createElement('p')
          p.innerHTML = name ? `- ${name}` : ''

          slide.appendChild(h3)
          slide.appendChild(p)
          wrapperRef.current.appendChild(slide)
        })
      })
      .then(() => {
        if (!window.Swiper) return

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
        state.current.ro = ro
      })
      .catch(console.error)

    return () => {
      state.current.ro?.disconnect?.()
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
        <div className="swiper-wrapper carosuel-out" ref={wrapperRef}>
        </div>
      </div>
    </div>
  )
}

window.Testamonies = Testamonies
