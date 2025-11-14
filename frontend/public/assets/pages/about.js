const About = () => {

  function useImageScalerHero() {
    React.useLayoutEffect(() => {
      const { gsap, ScrollTrigger } = window
      if (!gsap || !ScrollTrigger) return
      gsap.registerPlugin(ScrollTrigger)

      const parent = gsap.utils.toArray('.image-scaler-hero')
      const child = gsap.utils.toArray('.image-scaler-hero img')

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: parent,
          start: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(child, { scale: 1 + self.progress, y: 0 + self.progress * 800, rotate: 0 + self.progress * 10 })
        })
        ScrollTrigger.refresh()
      })

      return () => ctx.revert()
    }, [])
  }
  useImageScalerHero();

  function useMapPins() {
    React.useLayoutEffect(() => {
      const { gsap, ScrollTrigger } = window
      if (!gsap || !ScrollTrigger) return
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const parents = gsap.utils.toArray('.world-map')
        parents.forEach((parent) => {
          const pins = parent.querySelectorAll('.pins-1')
          if (!pins.length) return

          gsap.set(pins, { opacity: 0 })

          gsap.timeline({
            scrollTrigger: {
              trigger: parent,
              start: 'top 65%', 
              invalidateOnRefresh: true,
              toggleActions: 'play none none reverse'
            }
          })
          .fromTo(pins,{
            opacity: 0,
          },
          {
            opacity: 1,
            stagger: 0.5,
            duration: 1,
            ease: 'expo.out'
          })
        })

        ScrollTrigger.refresh()
      })

      return () => ctx.revert()
    }, [])
  }
  useMapPins();

  return (
    <div className="about-hero">
      <div className="hero-img image-scaler-hero">
          <img loading="lazy" className="two-img" src="/img/mango-wide-lf.webp" data-desktop-bkg-src="/img/mango-wide-lf.webp" data-mobile-bkg-src="/img/mango-lf.webp" />
      </div>

      <div className="sixtysix-thirtythree">
        <div className="sixtysix-thirtythree-2 world-map">
          <img loading="lazy" src="./img/world.svg" />
          <img loading="lazy" className="pins-1" src="./img/world-pin-1.png" />
          <img loading="lazy" className="pins-1" src="./img/world-pin-2.png" />
          <img loading="lazy" className="pins-1" src="./img/world-pin-3.png" />
        </div>
        <div className="sixtysix-thirtythree-1 ">
          <h2>
            For a decade I’ve honed my craft wandering across Europe—inside studios, back-alley cafés, pubs, and far too many Airbnbs.
          </h2>
          <h3>
            Wherever I land, I build things.
          </h3>
          <p>
            I craft digital experiences with the same energy I bring to everything else in my life: obsessive curiosity, a streak of rebellion, and an artist’s instinct for aesthetic. I’ve worked with The FA, fashion houses, musicians, automotive teams, DJs, and a repertoire that would take too long to list.
            <br/><br/>
            Years split between Amsterdam, Berlin, London, Nancy, Gothenburg, and Bristol shaped me. I speak multiple languages; I collect people, places, and stories—and I pour all of it into the work.
          </p>
        </div>
      </div>

      <div className="sixtysix-thirtythree">
        <div className="sixtysix-thirtythree-2 image-scaler">
          <img loading="lazy" src="./img/amsterdam.webp" />
        </div>
        <div className="sixtysix-thirtythree-1">
          <h5>
            I’ve built websites my whole career, but the story started long before the code.
          </h5>
          <p>
            I hold a Master’s in Creative Technology (UWE Bristol) and a Bachelor’s in Graphic Communication (NUA), but most of my real education came at stupid-o’clock—pulling ideas apart, reading behavioural psychology, and refining until it finally hit: “that’s the one.”
            <br/><br/>
            I’m a designer and a developer. My design work is rooted in behavioural science and the quiet parts of human psychology—Jung, consciousness, and the physics of perception. I rip colour apart in the lab, then rebuild it in code. That obsession became <em>Spectral Synthesis</em>, my ongoing exploration of light, colour theory, and how we actually see.
            <br/><br/>
            I can work across the stack, but I excel at the front end—animation, interaction, performance. I treat code like a paintbrush.
            <br/><br/>
            Before screens, there were canvases. Summers hitchhiking through France meant selling paintings on street corners or trading them for food, wine, cigarettes, or a lift. I did my first graffiti piece at 10 after spraying my BMX solid gold. That pull to the city took me to Berlin, Bristol, and Amsterdam—fences jumped, rooftops climbed, pseudonyms written big across tunnels and walls. The mango stuck 🥭.
            <br/><br/>
            Music’s always been there too. Hand me an instrument and I’ll make it sing—guitar, bass, drums, saxophone, and keys most of all. I don’t care about genre; if there’s a jam, I’m in.
            <br/><br/>
            I built my first website in 2015 using discontinued animation software that exported to HTML and JS. A developer friend on a Swedish island saw it, flew me out, and I fell head-first into JavaScript, WebGL, GSAP, and Three.js—anything that let me bend reality on a screen.
          </p>
        </div>
      </div>

      <div className="sixtysix-thirtythree">
        <div className="sixtysix-thirtythree-2 image-scaler">
          <img loading="lazy" src="./img/rotterdam.webp" />
        </div>
        <div className="sixtysix-thirtythree-1">
          <h5>
            First principles. One foot in tradition, one hand on the future.
          </h5>
          <p>
            People pick sides—design or dev. I didn’t. I see code in shapes and design in logic. At this point it’s basically synaesthesia. Today I travel with my dog, Bernadette, building for agencies, studios, and startups that want work that actually feels alive. I describe my role like a band: I play many instruments. Need a drummer? I’m there. Need a guitarist? Hand me the setlist. Need the whole song rewritten? That’s where it gets fun.
            <br/><br/>
            From initial concept to actualisation, each website I have created has been made without pretense or artifice, with the simple aim of celebrating what is good and has always been good about design. By studying the rules at the foot of the giants, I was then able to learn how and when to bend or break these rules, finding the perfect equilibrium between old/new, function/beauty, fiction/reality in order to create websites that captivate and inspire those who interact with them.
            <br/><br/>
            Experience and exploration have taught me the importance of knowing when to fiercely preserve tradition whilst also adapting to the new technologies, trends and styles that make and will always make websites special within the inescapably changing world we live in - one pixel at a time. Changes will continue to come and I hope to embrace them with the confidence and determination that has made me who I am today.
            <br/><br/>
            Outside of work, I’m in the top 10% of chess players globally. I’m consistently training and sparring in boxing and kickboxing. I'm into music (Who isn't?) — sometimes creating it, sometimes just enjoying it in the crowd. Most of the time though, I’m out walking my dog on a beach or through the woods, or sitting in a pub with a couple of cold beers.
          </p>
          <ContactBTN />
        </div>
      </div>
    </div>
  )
}

window.About = About