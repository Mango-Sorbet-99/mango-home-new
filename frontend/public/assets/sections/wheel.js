const Wheel = () => {
  useEffect(() => {
   let wheel = document.querySelector(".skills .wheel"),
      numLines = 8,
      radius = numLines * 20,
      angle = 360 / numLines,
      origin = `50% 50% -${radius}px`;

    gsap.set(wheel, { transformOrigin: "50% 50%" });
    gsap.set(wheel.querySelectorAll(".wheel-text"), {
      z: radius,
      rotationX: (index) => angle * index,
      transformOrigin: origin
    });

    gsap.to(wheel, {
      rotationX: -360,
      duration: 8,
      ease: "none",
      transformOrigin: "50% 50%",
      scrollTrigger: {
        trigger: '.skills',
        start: "center center",
        end: "+=600px",
        scrub: true,
        pin: true,
        ease: "none"
      }
    });
    return () => ctx.revert()
  }, [])

  return (
    <div className="skills">
      <div className="wheel">
        <h2 className="wheel-text">Creative Coding</h2>
        <h2 className="wheel-text">Digital Design</h2>
        <h2 className="wheel-text">Animation</h2>
        <h2 className="wheel-text">Conceptual art</h2>
        <h2 className="wheel-text">User Experience</h2>
        <h2 className="wheel-text">Interface Design</h2>
        <h2 className="wheel-text">Behavioral Science</h2>
        <h2 className="wheel-text">Motion Design</h2>
      </div>
    </div>


  )
}

window.Wheel = Wheel