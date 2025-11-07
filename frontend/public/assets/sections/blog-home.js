const BlogHome = () => {
  return (
    <div className="blogs txt-animate">
      <div className="sixtysix-thirtythree">
        <div className="sixtysix-thirtythree-1 ">
          <h3 className="title-animate">
            Blog* A glimpse into my journey, ideas, processes, brain, and random thoughts.
          </h3>
        </div>
      </div>
      <div className="blog-grid">
        <div className="blog-card glass">
          <img src="https://mango-media.eu/media/pages/projects/green-king/668393e359-1738847672/green-king.webp" />
          <h4 className="pr-title">Green King - Level Head</h4>
          <p className="pr-description">This project uses scrollytelling—a UX technique where a narrative unfolds as the user scrolls—to bring Level Head Session IPA to life. Inspired by St Edmund, the beheaded King of East Anglia, the experience isn’t just about selling a beer, but telling a legend. A 3D can dynamically follows the user’s journey, immersing them in the story while reinforcing the beer’s identity. From a UX perspective, the goal is clear: to not just introduce a drink, but to create an experience that convinces landlords to stock it in their venues.</p>
          <a>read more</a>
          <div className="pr-catagory">
            <div>3D</div><div>motion-design</div><div>UX UI</div><div>creative-coding</div>
          </div>
        </div>
        <div className="blog-card glass">
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
        <div className="blog-card glass">
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
      <div className="center-it">
        <div className="button-1 button glass btn-animate">
            <div className="LED"></div>
            <p>View all articles</p>
          </div>
      </div>
    </div>
  )
}

window.BlogHome = BlogHome