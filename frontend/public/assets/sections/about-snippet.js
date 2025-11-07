const AboutSnippet = () => {
  const sectionRef = React.useRef(null)
  React.useLayoutEffect(() => {
    gsap.timeline({
          scrollTrigger: {
            trigger: '.about-home img',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        })
        .fromTo('.about-home img', { scale: 0},{scale: 1, duration: 1.5, ease: 'bounce.out'})
        .fromTo('.about-home img', { rotation: 270},{rotation: 0, duration: 5, ease: 'expo.out'},0)
        .fromTo('.skills', { opacity: 1},{opacity: 0, duration: .5, ease: 'circ.out'},0)

    return () => ctx.revert()
  }, [])

  return (
    <div className="about-home">
      <div className="fifty-fifty">
        <div className="fifty-fifty-1">
            <img src="./img/just-eat-it.webp" />
        </div>
        <div className="fifty-fifty-2">
          <h5>
            Each project is a piece of my brain, heart, and maybe a bit of what’s inside yours.
          </h5>
          <p>
            At my core, I’m an artist who probably spends a little too much time wondering how we express ourselves through creativity — how art, music, and design can connect.  
            <br /><br />
            For over a decade, I’ve been experimenting at the crossroads of art, science, and technology — fusing motion, design, and code into digital experiences that feel more alive than they probably should.  
            <br /><br />
            I don’t just make websites; I build universes. Hence the space theme in most of my projects — because astrophysics isn’t just a passion, it’s the foundation of existence.  
            Each piece I create is part experiment, part emotion — shaped by curiosity, precision, and just enough chaos to keep it interesting.  
            <br /><br />
            I’ve collaborated with artists, agencies, and global brands to uncover what makes them unique — then turned it into something that moves, glows, and occasionally breaks the laws of physics (on purpose).  
            <br /><br />
            If you’re looking for something safe and sensible, we might not be a perfect match.  
            But if you want something unforgettable — let’s get messy, make magic, and see what we can cook up together. 
          </p>
          <div className="button-1 button glass btn-animate">
            <div className="LED"></div>
            <p>Get to know me more</p>
          </div>
        </div>
      </div>
    </div>
  )
}

window.AboutSnippet = AboutSnippet