(function () {
  function getGSAP() {
    return {
      gsap: window.gsap,
      ScrollTrigger: window.ScrollTrigger,
      ScrollSmoother: window.ScrollSmoother
    }
  }

  function refreshScroll() {
    const { ScrollTrigger, ScrollSmoother } = getGSAP()
    if (ScrollSmoother && ScrollSmoother.get) {
      const sm = ScrollSmoother.get()
      if (sm && sm.refresh) sm.refresh()
    }
    if (ScrollTrigger && ScrollTrigger.refresh) ScrollTrigger.refresh(true)
  }

  function debounce(fn, d) {
    let t
    return function () {
      clearTimeout(t)
      const a = arguments, ctx = this
      t = setTimeout(function () { fn.apply(ctx, a) }, d)
    }
  }

  const debouncedRefresh = debounce(refreshScroll, 200)

  window.addEventListener('load', refreshScroll)
  window.addEventListener('resize', debouncedRefresh)
  document.addEventListener('visibilitychange', function () { if (!document.hidden) debouncedRefresh() })

  if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
    document.fonts.ready.then(refreshScroll)
  }

  Promise.all(
    Array.from(document.images)
      .filter(function (img) { return !img.complete })
      .map(function (img) {
        return new Promise(function (r) {
          img.addEventListener('load', r, { once: true })
          img.addEventListener('error', r, { once: true })
        })
      })
  ).then(refreshScroll)

  var roTarget = document.getElementById('smooth-content') || document.body
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { debouncedRefresh() }).observe(roTarget)
  }

  window.resetScrollTriggers = refreshScroll
})()

function hasSmoother() {
  return !!(window && window.gsap && window.ScrollTrigger && window.ScrollSmoother && window.ScrollSmoother.create)
}

function useScrollSmoother(opts = {}) {
  React.useLayoutEffect(() => {
    let disposed = false, timer = null, smoother = null

    function init() {
      if (disposed) return
      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger
      const ScrollSmoother = window.ScrollSmoother
      if (!gsap || !ScrollTrigger || !ScrollSmoother || !ScrollSmoother.create) return

      const wrapperEl = document.querySelector('#smooth-wrapper')
      const contentEl = document.querySelector('#smooth-content')
      if (!wrapperEl || !contentEl || !wrapperEl.contains(contentEl)) {
        timer = setTimeout(init, 16)
        return
      }

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
      const existing = ScrollSmoother.get && ScrollSmoother.get()
      if (existing && existing.kill) existing.kill()

      smoother = ScrollSmoother.create({
        wrapper: wrapperEl,
        content: contentEl,
        smooth: 3,
        ease: 'expo.out',
        speed: 0.5,
        smoothTouch: 0.2,
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true,
        preventDefault: true,
        ...opts
      })

      if (window.resetScrollTriggers) window.resetScrollTriggers()
    }

    timer = setTimeout(init, 0)

    return () => {
      disposed = true
      if (timer) clearTimeout(timer)
      if (smoother && smoother.kill) smoother.kill()
    }
  }, [])
}

function useButtonsAnimator() {
  React.useLayoutEffect(() => {
    const gsap = window.gsap
    const SplitText = window.SplitText
    if (!gsap || !SplitText) return
    const buttons = Array.from(document.querySelectorAll('.btn-animate'))
    if (!buttons.length) return

    function measureAutoWidth(el) {
      const clone = el.cloneNode(true)
      const cs = getComputedStyle(el)
      Object.assign(clone.style, {
        position: 'absolute',
        visibility: 'hidden',
        pointerEvents: 'none',
        left: '-99999px',
        top: '0',
        width: 'auto',
        height: cs.height,
        transform: 'none',
        whiteSpace: 'nowrap',
        boxSizing: cs.boxSizing
      })
      document.body.appendChild(clone)
      const w = clone.getBoundingClientRect().width + 10
      clone.remove()
      return w
    }

    const contexts = buttons.map((el) =>
      gsap.context(() => {
        const led = el.querySelector('.LED')
        const p = el.querySelector('p')
        if (!p) return () => {}

        const split = new SplitText(p, { type: 'chars' })
        const rect = el.getBoundingClientRect()
        const h = rect.height || el.offsetHeight || 56

        gsap.set(el, {
          width: h,
          height: h,
          borderRadius: '9999px',
          transformOrigin: 'center center',
          willChange: 'transform,width,border-radius,opacity',
          boxSizing: 'border-box',
          overflow: 'hidden',
        })

        const targetW = measureAutoWidth(el)

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            invalidateOnRefresh: true,
            toggleActions: 'play none none reverse'
          }
        })

        tl.fromTo(el, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'bounce.out' })
          .fromTo(el, { width: h, height: h }, { width: targetW, duration: 1, ease: 'expo.inOut' })
          .fromTo(led, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1, ease: 'expo.in' }, '-=1')
          .fromTo(split.chars, { opacity: 0 }, { opacity: 1, stagger: 0.05, duration: 1, ease: 'expo.in' })

        return () => { if (tl && tl.kill) tl.kill(); if (split && split.revert) split.revert() }
      }, el)
    )
    window.ScrollTrigger.refresh(true)
    return () => contexts.forEach((c) => c && c.revert && c.revert())
  }, [])
}

function useTextAnimator() {
  React.useLayoutEffect(() => {
    const gsap = window.gsap
    const SplitText = window.SplitText
    if (!gsap || !SplitText) return
    const parents = Array.from(document.querySelectorAll('.txt-animate'))
    if (!parents.length) return

    const contexts = parents.map((parent) =>
      gsap.context(() => {
        const title = parent.querySelector('.title-animate')
        if (!title) return () => {}
        const body = Array.from(parent.querySelectorAll('.body-animate'))

        const split = new SplitText(title, { type: 'words' })
        gsap.set(split.words, { opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: parent,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,

          }
        })
        window.ScrollTrigger.refresh(true)
        tl.fromTo(split.words, { opacity: 0 }, { opacity: 1, stagger: 0.05, duration: 1, ease: 'expo.in' })
        if (body.length) tl.fromTo(body, { opacity: 0 }, { opacity: 1, delay: 0.5, duration: 2, stagger: 0.2, ease: 'expo.in' }, 0)

        return () => { if (tl && tl.scrollTrigger && tl.scrollTrigger.kill) tl.scrollTrigger.kill(); if (tl && tl.kill) tl.kill(); if (split && split.revert) split.revert() }
      }, parent)
    )

    return () => contexts.forEach((c) => c && c.revert && c.revert())
  }, [])
}

function useFullHeight() {
  React.useLayoutEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.full-height'))
    if (!nodes.length) return
    function vh() {
      return (window.visualViewport && window.visualViewport.height) || window.innerHeight
    }
    function setH() {
      const h = vh()
      document.documentElement.style.setProperty('--vh', (h * 0.01) + 'px')
      nodes.forEach(el => { el.style.height = h + 'px' })
    }
    setH()
    if (window.resetScrollTriggers) window.resetScrollTriggers()
    const onResize = () => {
      setH()
      if (window.resetScrollTriggers) window.resetScrollTriggers()
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])
}

function useImageScaler() {
  React.useLayoutEffect(() => {
    const { gsap, ScrollTrigger } = window
    if (!gsap || !ScrollTrigger) return
    gsap.registerPlugin(ScrollTrigger)

    const parents = gsap.utils.toArray('.image-scaler')
    if (!parents.length) return

    const ctx = gsap.context(() => {
      parents.forEach((parent) => {
        const img = parent.querySelector('img')
        gsap.set(img, { scale: 1, transformOrigin: 'center center' })
        ScrollTrigger.create({
          trigger: parent,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(img, { scale: 1 + self.progress })
        })
      })
      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [])
}

function twoIMG() {
  const imgs = document.querySelectorAll('img.two-img');
  const isDesktop = window.matchMedia('(min-width: 601px)').matches;

  imgs.forEach(img => {
    const mobile  = img.dataset.mobileBkgSrc;
    const desktop = img.dataset.desktopBkgSrc;
    const want = isDesktop ? desktop : mobile;
    if (!want) return;
    if (img.src !== want) img.src = want;
  });
}

const runTwoIMG = () => {
  requestAnimationFrame(twoIMG);
};

if (document.readyState !== 'loading') runTwoIMG();
window.addEventListener('DOMContentLoaded', runTwoIMG);
window.addEventListener('load', runTwoIMG);

let t;
window.addEventListener('resize', () => {
  clearTimeout(t);
  t = setTimeout(runTwoIMG, 150);
});


/* V I D E O    R E P L A C E */

const twoVideos = document.querySelectorAll('.two-videos');
twoVideos.forEach(video => {
  function replaceSource() {
      const desktopSrc = video.getAttribute('data-desktop-src');
      const mobileSrc = video.getAttribute('data-mobile-src');
      const currentSrc = video.getAttribute('src');
      const newSrc = window.innerWidth > 1080 ? desktopSrc : mobileSrc;
      if (currentSrc !== newSrc) {
          const wasPlaying = !video.paused;
          video.pause();
          video.setAttribute('src', newSrc);
          video.load();
          if (wasPlaying) {
              video.play();
          }
      }
  }
  ScrollTrigger.create({
      trigger: video,
      start: "top bottom+=200px",
      end: "bottom top",
      onEnter: replaceSource,
  });
});

function Main({ children }) {
  useFullHeight()
  useScrollSmoother()
  useTextAnimator()
  useButtonsAnimator()
  useImageScaler()
  twoIMG()
  return React.createElement(React.Fragment, null, children)
}

history.scrollRestoration = "manual";
window.addEventListener('beforeunload', function () {
  window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
  if (window.ScrollTrigger) {
    window.ScrollTrigger.refresh(true)
  }
})