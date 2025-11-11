const Projects = () => {
  const gridRef = React.useRef(null)

  React.useEffect(() => {
    const fetchJSON =
      window.fetchJSON ||
      (path =>
        fetch((window.API_URL || '') + path).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status} for ${(window.API_URL||'')+path}`)
          return r.json()
        }))

    const truncate = (str, n = 300) =>
      (str && str.length > n) ? str.slice(0, n).trim() + '…' : str

    async function load() {
      const j = await fetchJSON('/api/project?populate[ProjectDirect][populate]=Image')

      const list =
        (j?.data?.ProjectDirect) ||
        (j?.data?.attributes?.ProjectDirect) ||
        []

      const limited = list.slice(0, 16)

      if (!gridRef.current) return
      gridRef.current.innerHTML = ''

      limited.forEach(pd => {
        const imgObj = pd?.Image || null
        const imgUrl = (imgObj?.formats?.small?.url) || imgObj?.url || ''
        const absImg = imgUrl ? ((window.API_URL || '') + imgUrl) : ''
        const title = pd?.Title || ''
        const desc = truncate(pd?.Description || '')
        const url = pd?.URL || ''
        const cats = (pd?.catagories || '').split(/\s+/).filter(Boolean)

        const card = document.createElement('div')
        card.className = 'project-card glass'

        if (absImg) {
          const img = document.createElement('img')
          img.src = absImg
          img.alt = title
          card.appendChild(img)
        }

        const h4 = document.createElement('h4')
        h4.className = 'pr-title'
        h4.textContent = title
        card.appendChild(h4)

        const p = document.createElement('p')
        p.className = 'pr-description'
        p.textContent = desc
        card.appendChild(p)

        const link = document.createElement('a')
        link.textContent = 'view project'
        if (url) {
          link.href = url
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
        }
        card.appendChild(link)

        const catsWrap = document.createElement('div')
        catsWrap.className = 'pr-catagory'
        cats.forEach(c => {
          const tag = document.createElement('div')
          tag.textContent = c
          catsWrap.appendChild(tag)
        })
        card.appendChild(catsWrap)

        gridRef.current.appendChild(card)
      })
    }

    load().catch(err => console.error(err))
  }, [])

  return (
    <div className="projects ">
      <CodeBlock />
      <div className="fifty-fifty txt-animate">
        <div className="fifty-fifty-1">
          <h3 className="title-animate">
            I create interactive experiments that merge art, science, + technology.
          </h3>
        </div>
        <div className="fifty-fifty-2">
          <p className="project-text body-animate">
            Through design, motion, and code, I explore the physics of perception —
            where interaction becomes emotion, and light becomes language.
            <br /><br />
            Each project is an exploration of how technology can tell stories,
            evoke feeling, and give brands a living presence in the digital world.
            <br /><br />
            Over the past decade, I've collaborated with artists, agencies,
            and global brands — always with the same goal: to uncover what makes
            each brand unique, and to harmonize beauty with function in crafting
            bespoke, meaningful experiences.
          </p>
          <ContactBTN />
        </div>
      </div>

      <div className="project-grid" ref={gridRef}></div>

      <div className="container button-in-container">
        <a href="/projects">
          <div className="button-1 button glass btn-animate">
            <div className="LED"></div>
            <p>View all projects</p>
          </div>
        </a>
      </div>
    </div>
  )
}

window.Projects = Projects