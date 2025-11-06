const Logos = () => {
  const swiperRef = React.useRef(null)
  const inst = React.useRef(null)

  const logos = [
    './img/logos/adobe-illustrator-cc-3.svg',
    './img/logos/adobe-photoshop-2.svg',
    './img/logos/after-effects-1.svg',
    './img/logos/apple-11.svg',
    './img/logos/blender-1.svg',
    './img/logos/react-2.svg',
    './img/logos/threejs-1.svg',
    './img/logos/visual-studio-code-1.svg',
    './img/logos/figma-icon-one-color.svg',
    './img/logos/mercedes-svgrepo-com.svg',
    './img/logos/javascript-svgrepo-com.svg',
    './img/logos/chrome-svgrepo-com.svg'
  ]

  const stream = React.useMemo(() => [...logos, ...logos, ...logos], [])

  React.useEffect(() => {
    if (!swiperRef.current || !window.Swiper || !window.gsap || !window.ScrollTrigger) return

    if (inst.current && !inst.current.destroyed) inst.current.destroy(true, true)

    inst.current = new window.Swiper(swiperRef.current, {
      slidesPerView: 'auto',
      spaceBetween: 25,
      allowTouchMove: false,
      loop: true,
      loopedSlides: stream.length,
      loopAdditionalSlides: 16,
      centeredSlides: false,
      speed: 8000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
      }
    })

    const wrapper = swiperRef.current.querySelector('.swiper-wrapper')
    if (wrapper) wrapper.style.transitionTimingFunction = 'linear'

    inst.current?.autoplay?.stop()

    const trigger = ScrollTrigger.create({
      trigger: swiperRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => inst.current?.autoplay?.start(),
      onEnterBack: () => inst.current?.autoplay?.start(),
      onLeave: () => inst.current?.autoplay?.stop(),
      onLeaveBack: () => inst.current?.autoplay?.stop()
    })

    return () => {
      trigger.kill()
      if (inst.current && !inst.current.destroyed) inst.current.destroy(true, true)
    }
  }, [stream])

  return (
    <div className="logo-ticker">
      <div className="gradinet-left"></div>
      <div className="gradinet-right"></div>
      <div className="swiper" ref={swiperRef}>
        <div className="swiper-wrapper">
          {stream.map((src, i) => (
            <div className="swiper-slide" key={i}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

window.Logos = Logos
