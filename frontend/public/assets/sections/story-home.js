const { useEffect, useRef } = React;

const StoryHome = () => {
  const h2Ref = useRef(null);

  useEffect(() => {

    const splitText = new SplitText('.story-home h2', {
      type: 'words'
    });

    splitText.words.forEach((word) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: word,
          start: 'top bottom',
          end: 'top center',
          scrub: 0.5, 
        }
      });

      tl.fromTo(
        word, {
          opacity: 0,
        }, {
          opacity: 1,
          duration: 1,
          ease: 'expo.in'
        }
      );
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
      split.revert(); 
    };
  }, []);

  return (
    <div className="story-home">
      <h2 ref={h2Ref}>
        I am a creative coder, designer, + artist, with over a decade of experience working at the intersection of technology + creativity.
      </h2>
      <div className="button-1 button glass btn-animate">
        <div className="LED"></div>
        <p>
          Want to know more, visit the about page
        </p>
      </div>
    </div>
  );
};

window.StoryHome = StoryHome;