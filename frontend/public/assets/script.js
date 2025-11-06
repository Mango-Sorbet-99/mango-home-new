function MangoCanvas() {
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (!window.startMango || !ref.current) return
    const cleanup = window.startMango(ref.current)
    return () => {
      if (typeof cleanup === 'function') cleanup()
    }
  }, [])

  return (
    <div
      ref={ref}
      className="mango-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    />
  )
}

function App() {
  return (
    <>
      <Preloader />
      <Navigation />
      {/* <video className="grain" src="./img/grain.mp4" autoPlay loop muted playsInline /> */}
      <div className="button-1 button glass sticky-button">
        <div className="LED"></div>
        <p>
          Need a project (or a mango)?{' '}
          <span className="underline">hello@mango-media.eu</span>
        </p>
      </div>
      <div id="smooth-wrapper">
        <div id="smooth-content" className="container">
          <HeroHome />
          <StoryHome />
          <Projects />
          <Wheel />
          <AboutSnippet />
          <BlogHome />
          <Testamonies />
          <Logos />
          <Footer />
        </div>
      </div>
      <Main />
      <MangoCanvas />
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('app-root'))
root.render(<App />)