const ProjectsGridPage = () => {
  const gridRef = React.useRef(null)
  const filterRef = React.useRef(null)
  const allItemsRef = React.useRef([])

  React.useEffect(() => {
    const fetchJSON =
      window.fetchJSON ||
      (path =>
        fetch((window.API_URL || '') + path).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status} for ${(window.API_URL||'')+path}`)
          return r.json()
        }))

    async function load() {
      const j = await fetchJSON('/api/project?populate[ProjectDirect][populate]=Image')

      const list =
        (j?.data?.ProjectDirect) ||
        (j?.data?.attributes?.ProjectDirect) ||
        []

      allItemsRef.current = list

      buildFilters(list)

      renderCards(list)
    }

    function renderCards(items) {
      if (!gridRef.current) return
      gridRef.current.innerHTML = ''

      items.forEach(pd => {
        const imgObj = pd?.Image || null
        const imgUrl =
          (imgObj?.formats?.small?.url) ||
          (imgObj?.url) ||
          ''
        const absImg = imgUrl ? ((window.API_URL || '') + imgUrl) : ''
        const title = pd?.Title || ''
        const desc = pd?.Description || ''
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

    function buildFilters(list) {
      if (!filterRef.current) return

      filterRef.current.innerHTML = ''

      const allCats = new Set()
      list.forEach(pd => {
        const cats = (pd?.catagories || '').split(/\s+/).filter(Boolean)
        cats.forEach(c => allCats.add(c))
      })

      const filters = ['all', ...Array.from(allCats)]

      filters.forEach(cat => {
        const wrap = document.createElement('div')
        wrap.className = 'filter-outer'

        const btn = document.createElement('div')
        btn.className = 'pr-catagory filter-btn'
        btn.textContent = cat

        btn.addEventListener('click', () => {
          if (cat === 'all') {
            renderCards(allItemsRef.current)
          } else {
            const filtered = allItemsRef.current.filter(pd =>
              (pd?.catagories || '').split(/\s+/).includes(cat)
            )
            renderCards(filtered)
          }
        })

        wrap.appendChild(btn)
        filterRef.current.appendChild(wrap)
      })
    }

    load().catch(err => console.error(err))
  }, [])

  return (
    <div className="projectsPage txt-animate">
      <div className="fifty-fifty">
        <div className="fifty-fifty-1">
          <h3 className="title-animate">I create interactive experiments that merge art, science, + technology.</h3>
        </div>

        <div className="fifty-fifty-2">
          <p className="project-text body-animate">
            Through design, motion, and code, I explore the physics of perception —
            where interaction becomes emotion, and light becomes language.
            <br/><br/>
            Each project is an exploration of how technology can tell stories,
            evoke feeling, and give brands a living presence in the digital world.
            <br/><br/>
            Over the past decade, I've collaborated with artists, agencies,
            and global brands — always with the same goal: to uncover what makes
            each brand unique, and to harmonize beauty with function in crafting
            bespoke, meaningful experiences.
          </p>
          <ContactBTN />
        </div>
      </div>

      <div className="filter-bar" ref={filterRef}></div>

      <div className="project-grid" ref={gridRef}></div>
    </div>
  )
}

window.ProjectsGridPage = ProjectsGridPage
