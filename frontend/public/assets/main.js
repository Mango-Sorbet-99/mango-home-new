function useScrollSmoother() {
  React.useLayoutEffect(() => {
    const { gsap, ScrollTrigger, ScrollSmoother } = window
    if (!gsap || !ScrollTrigger || !ScrollSmoother) return
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
    const current = ScrollSmoother.get()
    if (current) current.kill()
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      smoothTouch: 0.2,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
      preventDefault: true,
    })
    return () => { if (smoother) smoother.kill() }
  }, [])
}

function useButtonsAnimator() {
  React.useLayoutEffect(() => {

    const buttons = gsap.utils.toArray('.btn-animate');

    function measureAutoWidth(el) {
    const clone = el.cloneNode(true);
    const cs = getComputedStyle(el);
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
    });
    document.body.appendChild(clone);
    const w = clone.getBoundingClientRect().width + 10;
    clone.remove();
    return w;
    }

    const contexts = buttons.map((el) =>
    gsap.context(() => {
        const led = el.querySelector('.LED');
        const p = el.querySelector('p');

        const split = new SplitText(p, { type: 'chars' });

        const h = el.getBoundingClientRect().height || el.offsetHeight || 56;

        gsap.set(el, {
        width: h,
        height: h,
        borderRadius: '9999px',
        transformOrigin: 'center center',
        willChange: 'transform,width,border-radius,opacity',
        boxSizing: 'border-box',
        overflow: 'hidden'
        });

        const targetW = measureAutoWidth(el);

        const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
        });

        tl.fromTo(el, { scale: 0 }, { scale: 1, duration: .5, ease: 'bounce.out' })
        .fromTo(el, { width: h, height: h }, { width: targetW, duration: 1, ease: 'expo.inOut' })
        .fromTo(led, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1, ease: 'expo.in' },'-=1')
        .fromTo(split.chars, { opacity: 0 }, { opacity: 1, stagger: 0.05, duration: 1, ease: 'expo.in' });

        return () => { tl.kill(); split.revert(); };
    }, el)
    );

    return () => contexts.forEach((c) => c.revert());
  }, []);
}

function useTextAnimator() {
  React.useLayoutEffect(() => {

    const parents = gsap.utils.toArray('.txt-animate')
    const contexts = parents.map((parent) =>
      gsap.context(() => {
        const title = parent.querySelector('.title-animate')
        if (!title) return () => {}
        const body = gsap.utils.toArray(parent.querySelectorAll('.body-animate'))

        const split = new SplitText(title, { type: 'words' })
        gsap.set(split.words, { opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: parent,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        })

        tl.fromTo(split.words, { opacity: 0 },{ opacity: 1, stagger: 0.05, duration: 1, ease: 'expo.in'  })
        if (body.length) tl.fromTo(body, { opacity: 0 }, { opacity: 1, delay: 1, duration: 2, stagger: 0.2, ease: 'expo.in' }, 0)

        return () => { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); split.revert() }
      }, parent)
    )

    return () => contexts.forEach((c) => c.revert())
  }, [])
}

function useFullHeight() {
  React.useEffect(() => {
    const setH = () => {
      const h = window.innerHeight
      document.querySelectorAll('.full-height').forEach((el) => { el.style.height = h + 'px' })
    }
    setH()
    window.addEventListener('resize', setH)
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const handleBeforeUnload = () => window.scrollTo(0, 0)
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('resize', setH)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
}

function Main({ children }) {
  useScrollSmoother()
  useTextAnimator()
  useButtonsAnimator()
  useFullHeight()
  return <>{children}</>
}