// ---------- utils ----------
const safeSlug = (s='') =>
  String(s)
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

const getImgUrl = (obj, pref=['large','medium','small']) => {
  if (!obj) return ''
  const o = obj?.data?.attributes || obj?.attributes || obj
  if (!o) return ''
  for (const k of pref) {
    const u = o?.formats?.[k]?.url
    if (u) return abs(u)
  }
  return abs(o?.url || '')
}

window.fetchJSON = window.fetchJSON || (path =>
  fetch((window.API_URL || '') + path).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${(window.API_URL||'')+path}`)
    return r.json()
  })
)

// ---------- components ----------
const BlogSingle = ({ post, onBack }) => {
  const imgObjRoot = post?.Image || null
  const hero = getImgUrl(imgObjRoot, ['medium','small'])
  const title = post?.Title || ''
  const intro = post?.introduction || post?.Excerpt || post?.Description || ''
  const concl = post?.conclusion || ''
  const dateStr = fmtDate(post?.Date || post?.publishedAt || '')
  const large = Array.isArray(post?.largeSection) ? post.largeSection : []
  const sections = Array.isArray(post?.section) ? post.section : []

  React.useEffect(() => {
    const imgs = Array.from(document.querySelectorAll('.blog-detail img'))
    Promise.all(imgs.map(img => (img?.decode ? img.decode().catch(()=>{}) : Promise.resolve())))
      .then(() => {
        if (window.ScrollTrigger?.refresh) requestAnimationFrame(() => window.ScrollTrigger.refresh(true))
      })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [post])

  function useImageScalerHero() {
    React.useLayoutEffect(() => {
      const { gsap, ScrollTrigger } = window
      if (!gsap || !ScrollTrigger) return
      gsap.registerPlugin(ScrollTrigger)
      const parent = gsap.utils.toArray('.image-scaler-hero')
      const child = gsap.utils.toArray('.image-scaler-hero img')
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: parent,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(child, { scale: 1 + self.progress })
        })
        ScrollTrigger.refresh()
      })
      return () => ctx.revert()
    }, [])
  }
  useImageScalerHero();

  return (
    <div className="blog-detail">
      {hero ? (
        <div className="hero-img image-scaler-hero">
          <img loading="lazy" src={hero} alt={title}/>
        </div>
      ) : null}

      <div className="blog-into">
        <a className="back-link" href="/blog" onClick={e=>{e.preventDefault(); onBack()}}>← Back to blog</a>
        {dateStr ? <h4>{dateStr}</h4> : null}
        <h2>{title}</h2>
        {intro ? <p>{intro}</p> : null}
      </div>

      {(large.length || sections.length) ? (
        <div className="blog-main">
          {large.map((s,i)=>{
            const t = s?.title || ''
            const b = s?.body || ''
            const lImg = getImgUrl( s?.image, ['large','medium','small'])
            if (!t && !b && !lImg) return null
            return (
              <div className="lImage-parent" key={`L${i}`}>
                <div className="">
                  {t ? <h5>{t}</h5> : null}
                  {b ? <p dangerouslySetInnerHTML={{ __html: b }} /> : null}
                </div>
                {lImg ? (
                  <div className="">
                    <img loading="lazy" src={lImg} alt={t || title || `large-${i}`} />
                  </div>
                ) : null}
              </div>
            )
          })}

          {sections.map((s,i)=>{
            const t = s?.title || ''
            const b = s?.body || ''
            const sImg = getImgUrl( s?.image, ['medium','small'])
            return (
              <div className="fifty-fifty" key={`S${i}`}>
                {sImg ? (
                  <div className="fifty-fifty-2 image-scaler">
                    <img loading="lazy" src={sImg} alt={t || `section-${i}`}/>
                  </div>
                ) : null}
                {(t || b) ? (
                  <div className="fifty-fifty-1">
                    {t ? <h5>{t}</h5> : null}
                    {b ? <p dangerouslySetInnerHTML={{ __html: b }} /> : null}
                  </div>
                ) : null}
              </div>
            )
          })}

          {concl ? (
            <div className="blog-into">
              <h5>Conclusion</h5>
              <p>{concl}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
window.BlogSingle = BlogSingle

const BlogHome = () => {
  const [list, setList] = React.useState([])
  const [view, setView] = React.useState('list')
  const [active, setActive] = React.useState(null)
  const gridRef = React.useRef(null)
  const bySlugRef = React.useRef(new Map())

  const BLOG_RE = /^\/blog(?:\/([^/?#]+))?\/?$/
  const IS_ON_BLOG_ROUTE = BLOG_RE.test(location.pathname)

  const getSlug = React.useCallback((item) => {
    const cms = (item?.Slug || '').trim()
    return cms ? safeSlug(cms) : safeSlug(item?.Title || '')
  }, [])

  React.useEffect(() => {
    const goList = (push=true) => {
      setView('list'); setActive(null)
      if (IS_ON_BLOG_ROUTE && push) history.pushState({ view:'list' }, '', '/blog')
      requestAnimationFrame(() => {
        const imgs = Array.from((gridRef.current||document).querySelectorAll('img'))
        Promise.all(imgs.map(img => img?.decode ? img.decode().catch(()=>{}) : Promise.resolve()))
          .then(() => { if (window.ScrollTrigger?.refresh) requestAnimationFrame(() => window.ScrollTrigger.refresh(true)) })
      })
    }

    const goDetail = (rawSlug, push=true) => {
      const slug = safeSlug(rawSlug || '')
      const b = bySlugRef.current.get(slug)
      if (!b) return
      setActive(b); setView('detail')
      if (IS_ON_BLOG_ROUTE && push) history.pushState({ view:'detail', slug }, '', `/blog/${encodeURIComponent(slug)}`)
    }

    const onPop = () => {
      if (!IS_ON_BLOG_ROUTE) return 
      const path = location.pathname || ''
      const m = path.match(BLOG_RE)
      if (m && m[1]) goDetail(decodeURIComponent(m[1]), false)
      else if (m) goList(false)
    }

    window.addEventListener('popstate', onPop)

    async function load() {
      const path =
        '/api/project' +
        '?populate[Blog][populate]=Image,largeSection,section' +
        '&populate[Blog][populate][Image][populate]=*' +
        '&populate[Blog][populate][largeSection][populate]=image' +
        '&populate[Blog][populate][section][populate]=image' +
        '&populate[Blog][populate]=*'
      const j = await window.fetchJSON(path)
      const raw = (j?.data?.Blog) || (j?.data?.attributes?.Blog) || []
      setList(raw)
      const entries = raw.map(x => [getSlug(x), x])
      bySlugRef.current = new Map(entries)

      if (IS_ON_BLOG_ROUTE) {
        const path = location.pathname || ''
        const m = path.match(BLOG_RE)
        if (m && m[1]) {
          const want = safeSlug(decodeURIComponent(m[1]))
          const pre = bySlugRef.current.get(want) || raw[0]
          if (pre) { setActive(pre); setView('detail') } else { goList(false) }
        } else {
          goList(false)
        }
      } else {
        setView('list')
      }
    }

    load().catch(console.error)
    return () => window.removeEventListener('popstate', onPop)
  }, [getSlug, IS_ON_BLOG_ROUTE])

  const truncate = (s, n = 260) => (s && s.length > n) ? s.slice(0, n).trim() + '…' : (s || '')

  if (IS_ON_BLOG_ROUTE && view === 'detail' && active) {
    return (
      <div className="blogs txt-animate">
        <BlogSingle
          post={active}
          onBack={() => {
            history.pushState({view:'list'},'', '/blog')
            setView('list'); setActive(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="blogs txt-animate">
      <div className="fifty-fifty">
        <div className="fifty-fifty-1 ">
          <h3 className="title-animate">Blog* A glimpse into my journey, ideas, processes, brain, and random thoughts.</h3>
        </div>
      </div>

      <div className="blog-grid" ref={gridRef}>
        {list.slice(0, IS_ON_BLOG_ROUTE ? list.length : 3).map((b,i) => {
          const cover = getImgUrl(b?.Image)
          const title = b?.Title || ''
          const desc = truncate(b?.Description || b?.introduction || '')
          const slug = getSlug(b)
          const external = b?.URL || ''
          const dateStr = fmtDate(b?.Date || b?.publishedAt || '')
          const isExternal = external && /^https?:\/\//i.test(external)

          const handleClick = (e) => {
            if (!IS_ON_BLOG_ROUTE) {
              e.preventDefault()
              location.assign(`/blog/${encodeURIComponent(slug)}`)
              return
            }
            e.preventDefault()
            history.pushState({view:'detail', slug},'', `/blog/${encodeURIComponent(slug)}`)
            const p = bySlugRef.current.get(slug)
            if (p) { setActive(p); setView('detail') }
          }

          const handleKey = (e) => {
            if (e.key==='Enter' || e.key===' ') {
              handleClick(e)
            }
          }

          return (
            <div className="blog-card glass" key={slug || i}>
              {cover ? <img src={cover} alt={title}/> : null}
              <div className="pr-catagory">{dateStr ? <div>{dateStr}</div> : null}</div>
              <h4 className="pr-title">{title}</h4>
              {desc ? <p className="pr-description">{desc}</p> : null}
              {isExternal ? (
                <a className="read-more" href={external} target="_blank" rel="noopener noreferrer">read more</a>
              ) : (
                <a
                  className="read-more"
                  href={`/blog/${encodeURIComponent(slug)}`}
                  onClick={handleClick}
                  role="link"
                  tabIndex={0}
                  onKeyDown={handleKey}
                >read more</a>
              )}
            </div>
          )
        })}
      </div>

      <div className="center-it">
        <a
          href="/blog"
          onClick={e => {
            if (!IS_ON_BLOG_ROUTE) return
            e.preventDefault()
            history.pushState({view:'list'},'', '/blog')
            window.scrollTo({ top: 0, behavior:'auto' })
          }}
        >
          <div className="button-1 button glass btn-animate">
            <div className="LED"></div>
            <p>View all articles</p>
          </div>
        </a>
      </div>
    </div>
  )
}
window.BlogHome = BlogHome
