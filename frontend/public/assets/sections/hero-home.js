const { useLayoutEffect } = React;

const HeroHome = () => {
  useLayoutEffect(() => {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'bottom 75%',
        end: 'bottom 50%',
        scrub: 0.5,
      }
    });

    if (window.innerWidth > 600) {
      tl.fromTo(
      '.hero socials',
      { opacity: 1 },
      {
        opacity: 0,
        duration: 1,
        ease: 'circ.in'
      }
    )}

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div className="hero full-height">
      <div className="socials hidden-mobile">
        <div className="socials-items">
          <h4>socials</h4>
          <a>Whatsapp</a>
          <a>Instagram</a>
          <a>LinkedIn</a>
          <a>Chess.com</a>
        </div>
      </div>
    </div>
  );
};

window.HeroHome = HeroHome;