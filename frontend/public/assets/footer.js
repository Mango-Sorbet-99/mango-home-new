const Footer = () => {
    React.useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const ctx = gsap.context(() => {
      const footer = document.querySelector('.footer');
      const footerEmail = document.querySelector('.footer-email');
      if (!footer || !footerEmail) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top 25%',
          toggleActions: 'play none none reverse'
        }
      })
      .to(gsap.utils.toArray('.nav'), { opacity: 0, y: '-100%', duration: 1.5, ease: 'expo.in' })
      .to(gsap.utils.toArray('.sticky-button'), { opacity: 0, x: '100%', duration: .7, ease: 'expo.in' }, 0)
      const splitEmail = new SplitText(footerEmail, { type: 'chars' });
      gsap.set(splitEmail.chars, { opacity: 0 });

      gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }).fromTo(splitEmail.chars, { opacity: 0 }, { opacity: 1, stagger: 0.2, duration: 2, ease: 'expo.in' });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="footer glass full-height">
      <div className="footer-colums">
        <div className="footer-items">
          <h4>Menu</h4>
          <a>About</a>
          <a>Projects</a>
          <a>Blog</a>
          <a>Résumé</a>
          <a>Contact</a>
        </div>
        <div className="footer-items">
          <h4>Socials</h4>
          <a>Whatsapp</a>
          <a>Instagram</a>
          <a>LinkedIn</a>
          <a>Chess.com</a>
        </div>
      </div>
      <a className="footer-email underline"><h3>hello@mango-media.eu</h3></a>
      <div className="footer-colums">
        <div className="footer-items">
          <h4>Boring Stuff</h4>
          <a>FAQ</a>
          <a>Datenschutz</a>
          <a>Terms + Conditions</a>
        </div>
        <div className="phonenumbers">
          <div className="phone-num">
            <div className="button-1 button glass"><p>🇬🇧&nbsp;+44&nbsp;7519&nbsp;418&nbsp;970</p></div>
            <div className="button-1 button glass"><p>🇫🇷&nbsp;+33&nbsp;7531&nbsp;418&nbsp;67</p></div>
            <div className="button-1 button glass"><p>🇳🇱&nbsp;+31&nbsp;6847&nbsp;446&nbsp;91</p></div>
          </div>
          <p className="phoneStatement p2">*The British number is always on, the French and Dutch numbers are sometimes off.</p>
        </div>
      </div>
    </div>
  )
}
window.Footer = Footer;