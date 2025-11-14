window.API_URL = window.API_URL || 'https://satisfying-boat-18e59cc8b5.strapiapp.com'

if (!window.GlobalDataSetup) {
  function fetchJSON(path) {
    const url = window.API_URL + path
    return fetch(url).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`)
      return r.json()
    })
  }

  window.GlobalDataContext = React.createContext({
    loading: true,
    error: null,
    home: null,
    global: null
  })

  function GlobalDataProvider({ children }) {
    const [state, setState] = React.useState({
      loading: true,
      error: null,
      home: null,
      global: null
    })

    React.useEffect(() => {
      let alive = true

      Promise.all([
        fetchJSON('/api/home?populate=*'),
        fetchJSON('/api/global?populate[navigation][populate][logo][populate]=*'),
        fetchJSON('/api/global?populate=*'),
        fetchJSON('/api/global?populate[email][populate][email][populate]=*'),
        fetchJSON('/api/global?populate[otherMenus][populate][urls][populate]=*'),
        fetchJSON('/api/project?populate=*'),
        fetchJSON('/api/project?populate[ProjectDirect][populate]=*')
      ])
        .then(([homeRes, globalRes]) => {
          if (!alive) return
          const norm = (res) => {
            const d = res?.data
            if (!d) return {}
            return d?.attributes ? { id: d.id, ...d.attributes } : d
          }
          const homeObj = norm(homeRes)
          const globalObj = norm(globalRes)
          setState({ loading: false, error: null, home: homeObj, global: globalObj })
        })
        .catch((e) => {
          if (!alive) return
          console.error('Data bootstrap error:', e)
          setState({ loading: false, error: e, home: null, global: null })
        })

      return () => { alive = false }
    }, [])

    return React.createElement(window.GlobalDataContext.Provider, { value: state }, children)
  }

  window.useGlobalData = () => React.useContext(window.GlobalDataContext)
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

function SpaceCanvas() {
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (!window.startSpace || !ref.current) return
    const cleanup = window.startSpace(ref.current)
    return () => { if (typeof cleanup === 'function') cleanup() }
  }, [])
  return (
    <div
      ref={ref}
      className="space-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: -1, width: '100vw', height: '100vh', overflow: 'hidden' }}
    />
  )
}

const BLOG_RE = /^\/blog(?:\/[^/?#]+)?\/?$/;

function HomePage() {
  React.useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "./assets/style/home.css"
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  if (BLOG_RE.test(location.pathname)) {
    return (
      <>
        <Preloader />
        <Navigation />
        <div id="smooth-wrapper">
          <div id="smooth-content" className="container">
            <BlogHome />
            <Footer />
          </div>
        </div>
        <Main />
        <SpaceCanvas />
      </>
    )
  }

  return (
    <>
      <Preloader />
      <Navigation />
      <StickyBTN />
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

function ContactPage() {
    React.useEffect(() => {
    document.body.classList.add("contact-page-outer")
    return () => {
      document.body.classList.remove("contact-page-outer")
    }
  }, [])
  return (
    <>
      <Preloader />
      <div className="container">
        <Footer />
      </div>
      <Main />
      <SpaceCanvas />
    </>
  )
}

function ProjectPage() {
  React.useEffect(() => {
    document.body.classList.add("project-page-outer")
    return () => {
      document.body.classList.remove("project-page-outer")
    }
  }, [])
  return (
    <>
      <Preloader />
      <Navigation />
      <div id="smooth-wrapper">
        <div id="smooth-content" className="container">
          <ProjectsGridPage />
          <Footer />
        </div>
      </div>
      <Main />
      <SpaceCanvas />
    </>
  )
}

function BlogsGridPage2() {
  React.useEffect(() => {
    document.body.classList.add("blog-page-outer")
    return () => {
      document.body.classList.remove("blog-page-outer")
    }
  }, [])
  return (
    <>
      <Preloader />
      <Navigation />
      <div id="smooth-wrapper">
        <div id="smooth-content" className="container">
          <BlogsGridPage />
          <Footer />
        </div>
      </div>
      <Main />
      <SpaceCanvas />
    </>
  )
}

function ResumePage() {
  return (
    <>
      <Preloader />
      <Navigation />
      <div id="smooth-wrapper">
        <div id="smooth-content" className="container">
          <Resume />
          <Footer />
        </div>
      </div>
      <Main />
      <SpaceCanvas />
    </>
  )
}

function FAQPage() {
  React.useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "./assets/style/FAQ.css"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])
  return (
    <>
      <Preloader />
      <Navigation />
      <div id="smooth-wrapper">
        <div id="smooth-content" className="container">
          <FAQ />
          <Footer />
        </div>
      </div>
      <Main />
      <SpaceCanvas />
    </>
  )
}

function DataPage() {
  return (
    <>
      <Preloader />
      <Navigation />
      <div id="smooth-wrapper">
        <div id="smooth-content" className="container">
          <Data />
          <Footer />
        </div>
      </div>
      <Main />
      <SpaceCanvas />
    </>
  )
}

function TermsPage() {
  return (
    <>
      <Preloader />
      <Navigation />
      <div id="smooth-wrapper">
        <div id="smooth-content" className="container">
          <Terms />
          <Footer />
        </div>
      </div>
      <Main />
      <SpaceCanvas />
    </>
  )
}

function AboutPage() {
  React.useEffect(() => {
    document.body.classList.add("about-page-outer")
    return () => {
      document.body.classList.remove("about-page-outer")
    }
  }, [])
  React.useEffect(() => {
    const links = [
      "./assets/style/FAQ.css",
      "./assets/style/about.css"
    ].map(href => {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = href
      document.head.appendChild(link)
      return link
    })

    return () => {
      links.forEach(link => document.head.removeChild(link))
    }
  }, [])

  return (
    <>
      <Preloader />
      <Navigation />
      <div id="smooth-wrapper">
        <div id="smooth-content" className="container">
          <About />
          <Logos />
          <FAQ />
          <Footer />
        </div>
      </div>
      <Main />
      <SpaceCanvas />
    </>
  )
}

function ProjectSinglePage() {
  React.useEffect(() => {
    document.body.classList.add("project-page-outer")
    return () => {
      document.body.classList.remove("project-page-outer")
    }
  }, [])
  React.useEffect(() => {
    const links = [
      "./assets/style/project-single.css"
    ].map(href => {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = href
      document.head.appendChild(link)
      return link
    })

    return () => {
      links.forEach(link => document.head.removeChild(link))
    }
  }, [])

  return (
    <>
      <Preloader />
      <Navigation />
      <div id="smooth-wrapper">
        <div id="smooth-content" className="container">
          <ProjectSingle />
          <Footer />
        </div>
      </div>
      <Main />
      <SpaceCanvas />
    </>
  )
}

function usePathname() {
  const [path, setPath] = React.useState(window.location.pathname)
  React.useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)

    const onClick = (e) => {
      const a = e.target.closest('a[data-nav]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      e.preventDefault()
      if (href !== window.location.pathname) {
        history.pushState({}, '', href)
        onPop()
      }
    }
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
    }
  }, [])
  return path
}

function Router() {
  const path = usePathname()
  if (path === '/contact') return <ContactPage />
  if (path === '/projects') return <ProjectPage />
  if (path === '/blog') return <BlogsGridPage2 />
  if (path === '/FAQ-OFF') return <FAQPage />
  if (path === '/about') return <AboutPage />
  if (path === '/projectSingle') return <ProjectSinglePage />
  if (path === '/datenschutz') return <DataPage />
  if (path === '/terms') return <TermsPage />
  if (path === '/resume') return <ResumePage />
  return <HomePage />
}

function App() {
  const Provider = window.GlobalDataProvider

  console.log('App render, Provider =', Provider)

  if (!Provider) {
    return (
      <div style={{ color: 'white', padding: '40px' }}>
        <h1>Safari debug</h1>
        <p>GlobalDataProvider is not defined on window.</p>
      </div>
    )
  }

  return (
    <Provider>
      <Router />
    </Provider>
  )
}


const root = ReactDOM.createRoot(document.getElementById('app-root'))
root.render(<App />)