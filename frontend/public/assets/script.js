window.API_URL = window.API_URL || 'http://localhost:1337'

if (!window.GlobalDataSetup) {
  function fetchJSON(path) {
    const url = window.API_URL + path
    return fetch(url).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`)
      return r.json()
    })
  }

  const GlobalDataContext = React.createContext({
    loading: true, error: null, home: null, global: null
  })

  function GlobalDataProvider({ children }) {
    const [state, setState] = React.useState({
      loading: true, error: null, home: null, global: null
    })

    React.useEffect(() => {
      let alive = true
      Promise.all([
        fetchJSON('/api/home?populate=*'),
        fetchJSON('/api/global?populate[navigation][populate][logo][populate]=*')
      ]).then(([homeRes, globalRes]) => {
        if (!alive) return
        const norm = (res) => {
          const d = res?.data
          if (!d) return {}
          return d?.attributes ? { id: d.id, ...d.attributes } : d
        }
        const homeObj = norm(homeRes)
        const globalObj = norm(globalRes)
        setState({ loading: false, error: null, home: homeObj, global: globalObj })
      }).catch((e) => {
        if (!alive) return
        console.error('Data bootstrap error:', e)
        setState({ loading: false, error: e, home: null, global: null })
      })
      return () => { alive = false }
    }, [])

    return React.createElement(GlobalDataContext.Provider, { value: state }, children)
  }

  window.useGlobalData = () => React.useContext(GlobalDataContext)
  window.GlobalDataProvider = GlobalDataProvider
  window.GlobalDataSetup = true
}

function MangoCanvas() {
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (!window.startMango || !ref.current) return
    const cleanup = window.startMango(ref.current)
    return () => { if (typeof cleanup === 'function') cleanup() }
  }, [])
  return (
    <div
      ref={ref}
      className="mango-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: -1, width: '100vw', height: '100vh', overflow: 'hidden' }}
    />
  )
}

function AppInner() {
  return (
    <>
      <Preloader />
      <Navigation />
      <div className="button-1 button glass sticky-button">
        <div className="LED"></div>
        <p>
          Need a project (or a mango)?{' '}
          <span className="underline">hello@mango&#8209;media.eu</span>
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

function App() {
  const Provider = window.GlobalDataProvider
  return <Provider><AppInner /></Provider>
}

const root = ReactDOM.createRoot(document.getElementById('app-root'))
root.render(<App />)