const BlogsGridPage = () => {
  const [list, setList] = React.useState([])
  const gridRef = React.useRef(null)

  React.useEffect(() => {
    document.body.classList.add("blog-page-outer")
    return () => document.body.classList.remove("blog-page-outer")
  }, [])

  React.useEffect(() => {
    const fetchJSON = window.fetchJSON || (path =>
      fetch((window.API_URL || '') + path).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
    )

    const load = async () => {
      const q =
        '/api/project' +
        '?populate[Blog][populate]=Image,largeSection,section' +
        '&populate[Blog][populate][Image][populate]=*' +
        '&populate[Blog][populate][largeSection][populate]=image' +
        '&populate[Blog][populate][section][populate]=image' +
        '&populate[Blog][populate]=*'
      const j = await fetchJSON(q)
      const raw = (j?.data?.Blog) || (j?.data?.attributes?.Blog) || []
      setList(Array.isArray(raw) ? raw : [])
      requestAnimationFrame(() => {
        const imgs = Array.from((gridRef.current || document).querySelectorAll('img'))
        Promise.all(imgs.map(img => img?.decode ? img.decode().catch(()=>{}) : Promise.resolve()))
          .then(() => { if (window.ScrollTrigger?.refresh) requestAnimationFrame(() => window.ScrollTrigger.refresh(true)) })
      })
    }

    load().catch(console.error)
  }, [])

  const toSlug = s =>
    String(s || '')
      .normalize('NFKD')
      .replace(/['"’”‘“`]/g, '')
      .replace(/&/g, 'and')
      .replace(/\/+/g, '-')
      .replace(/[^a-z0-9\-._\s]/gi, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()

  const fmtDate = isoish => {
    if (!isoish) return ''
    if (/\d{1,2}\/\d{1,2}\/\d{2,4}/.test(isoish)) return isoish
    const d = new Date(isoish); if (isNaN(d)) return isoish
    const dd = String(d.getDate()).padStart(2,'0')
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  const abs = u => {
    if (!u) return ''
    if (/^https?:\/\//i.test(u)) return u
    const base = (window.API_URL || '')
    const path = u.startsWith('/') ? u : `/${u}`
    return `${base}${path}`
  }

  const pickImgUrl = (obj, pref=['large','medium','small']) => {
    if (!obj) return ''
    const o = Array.isArray(obj)
      ? (obj[0]?.data?.attributes || obj[0]?.attributes || obj[0])
      : (obj?.data?.attributes || obj?.attributes || obj)
    if (!o) return ''
    for (const k of pref) {
      const u = o?.formats?.[k]?.url
      if (u) return abs(u)
    }
    return abs(o?.url || '')
  }

  return (
    <div className="project-grid blogs" ref={gridRef}>
      {list.map((b,i) => {
        const title = b?.Title || ''
        const desc = b?.Description || b?.introduction || ''
        const slug = toSlug((b?.Slug || '').trim() || title)
        const cover = getImgUrl(b?.Image)
        const dateStr = fmtDate(b?.Date || b?.publishedAt || '')
        const href = `/blog/${encodeURIComponent(slug)}`
        const go = e => { e.preventDefault(); location.assign(href) }

        return (
          <div className="project-card glass blog-card" key={slug || i}>
            {cover ? <img src={cover} alt={title}/> : null}
            <div className="pr-catagory">{dateStr ? <div>{dateStr}</div> : null}</div>
            <h4 className="pr-title">{title}</h4>
            {desc ? <p className="pr-description">{desc}</p> : null}
            <a href={href} onClick={go}>read more</a>
          </div>
        )
      })}
    </div>
  )
}

window.BlogsGridPage = BlogsGridPage
