const Projects = () => {
  useEffect(() => {
    /*
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.project-card')
      cards.forEach((card) => {
        const kids = card.querySelectorAll('img, .pr-title, .pr-description, a, .pr-catagory > *')
        gsap.set(card, { opacity: 0 })
        gsap.set(kids, { opacity: 0 })

        gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        })
        .to(card, { opacity: 1, duration: .7, ease: 'expo.inOut'  })
        .to(kids, { opacity: 1, opacity: 1, stagger: 0.5, duration: 2, ease: 'expo.inOut' })
      })
    })
*/
    return () => ctx.revert()
  }, [])

  return (
    <div className="projects txt-animate">
      <div className="fifty-fifty">
        <div className="fifty-fifty-1">
          <h3 className="title-animate">
            I create interactive experiments that merge art, science, + technology.
          </h3>
        </div>
        <div className="fifty-fifty-2">
          <p className="project-text body-animate">
            Through design, motion, and code, I explore the physics of perception —
            where interaction becomes emotion, and light becomes language.
            <br />
            <br />
            Each project is an exploration of how technology can tell stories,
            evoke feeling, and give brands a living presence in the digital world.
            <br />
            <br />
            Over the past decade, I've collaborated with artists, agencies,
            and global brands — always with the same goal: to uncover what makes
            each brand unique, and to harmonize beauty with function in crafting
            bespoke, meaningful experiences.
          </p>
          <div className="button-1 button glass btn-animate">
            <div className="LED"></div>
            <p>Let's create something together</p>
          </div>
        </div>
      </div>
      <div className="project-grid">
        <div className="project-card glass">
          <img src="https://mango-media.eu/media/pages/projects/green-king/668393e359-1738847672/green-king.webp" />
          <h4 className="pr-title">Green King - Level Head</h4>
          <p className="pr-description">This project uses scrollytelling—a UX technique where a narrative unfolds as the user scrolls—to bring Level Head Session IPA to life. Inspired by St Edmund, the beheaded King of East Anglia, the experience isn’t just about selling a beer, but telling a legend. A 3D can dynamically follows the user’s journey, immersing them in the story while reinforcing the beer’s identity. From a UX perspective, the goal is clear: to not just introduce a drink, but to create an experience that convinces landlords to stock it in their venues.</p>
          <a>read more</a>
          <div className="pr-catagory">
            <div>3D</div><div>motion-design</div><div>UX UI</div><div>creative-coding</div>
          </div>
        </div>
        <div className="project-card glass">
          <img src="https://mango-media.eu/media/pages/projects/colas-cup/78d70d365f-1739179454/colas9.png" />
          <h4 className="pr-title">Colas Cup</h4>
          <p className="pr-description">
            La Colas Team Cup est une compétition ouverte à tous les collaborateurs et collaboratrices majeurs du groupe Colas en contrat à durée indéterminée (CDI), en contrat de travail longue durée (hors CDD, stage, apprentissage et intérim) et en contrat d’alternance. Cette compétition est organisée autour de trois disciplines : le football à 5, la course à pied et Incroyables Talents.
          </p>
          <a>read more</a>
          <div className="pr-catagory">
            <div>3D</div><div>motion-design</div><div>UX UI</div><div>creative-coding</div>
          </div>
        </div>
        <div className="project-card glass">
          <img src="https://mango-media.eu/media/pages/projects/spectral-synthesis/ba8ea2c0e8-1738576295/spectral-3.png" />
          <h4 className="pr-title">
            Spectral Synthesis - Colour Theory in Physics
          </h4>
          <p className="pr-description">
            A Three.js creative coding project that delves into the fundamental relationship between colour and light in physics. Through an interactive experience, we explore the pioneering experiments of Isaac Newton, including his work with prisms and the visible spectrum, alongside other key scientific concepts such as the Doppler Effect and redshift. This project is not just about physics—it also touches on behavioural science, examining how colour influences perception and emotion. Using red, green, and blue spotlights, representing the three primary colours of the RGB spectrum, users can manipulate light to experience additive colour mixing in real time. By merging code, art, and science, …
          </p>
          <a>read more</a>
          <div className="pr-catagory">
            <div>3D</div><div>motion-design</div><div>UX UI</div><div>creative-coding</div>
          </div>
        </div>
      </div>
    </div>
  )
}

window.Projects = Projects