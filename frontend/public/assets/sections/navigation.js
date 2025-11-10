const Navigation = () => {
  const { loading, global } = window.useGlobalData ? window.useGlobalData() : { loading: false, global: {} }
  const g = Array.isArray(global) ? (global[0] || {}) : (global || {})
  const nav = g.navigation || {}
  const RRD = window.ReactRouterDOM || {}
  const { Link } = RRD

  const findFirstUrl = (node) => {
    if (!node || typeof node !== 'object') return null
    if (typeof node.url === 'string') return node.url
    if (node.attributes && typeof node.attributes.url === 'string') return node.attributes.url
    if (node.data) {
      const d = node.data
      if (typeof d === 'object') {
        const u1 = findFirstUrl(d)
        if (u1) return u1
      }
      if (Array.isArray(d)) {
        for (const it of d) {
          const u2 = findFirstUrl(it)
          if (u2) return u2
        }
      }
    }
    for (const k in node) {
      const v = node[k]
      if (v && typeof v === 'object') {
        const u = findFirstUrl(v)
        if (u) return u
      }
    }
    return null
  }

  const rawLogoUrl = findFirstUrl(nav.logo?.logo) || findFirstUrl(nav.logo) || null
  const logoUrl = rawLogoUrl ? (rawLogoUrl.startsWith('http') ? rawLogoUrl : (window.API_URL || '') + rawLogoUrl) : null

  const items =
    (Array.isArray(nav.logo?.menultems) && nav.logo.menultems) ||
    (Array.isArray(nav.logo?.menuitems) && nav.logo.menuitems) ||
    (Array.isArray(nav.logo?.menuItems) && nav.logo.menuItems) ||
    (Array.isArray(nav.menultems) && nav.menultems) ||
    (Array.isArray(nav.menuitems) && nav.menuitems) ||
    (Array.isArray(nav.menuItems) && nav.menuItems) ||
    []

  const renderItem = (it) => {
    const href = it?.href || it?.url || '#'
    const label = it?.label || it?.title || ''
    const isExternal = it?.isExternal === true || /^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
    const key = it?.id ?? href + label
    if (Link && !isExternal) return <Link key={key} to={href.startsWith('/') ? href : `/${href}`}>{label}</Link>
    return <a key={key} href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}>{label}</a>
  }

  return (
    <div className="glass nav">
      <div className="logo">
        {logoUrl ? (Link ? <Link to="/"><img src={logoUrl} alt="Logo" /></Link> : <a href="/"><img src={logoUrl} alt="Logo" /></a>) : (loading ? '...' : null)}
      </div>
      <div className="menu">
        <div className="menu-items">
          {loading && items.length === 0 ? '...' : items.map(renderItem)}
          <a href="projectSingle">BOOBIES</a>
        </div>
        <div className="hamburger" />
      </div>
    </div>
  )
}
window.Navigation = Navigation