const Navigation = () => {
  const { loading, global } = window.useGlobalData()
  const g = Array.isArray(global) ? (global[0] || {}) : (global || {})
  const nav = g.navigation || {}

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

  const rawLogoUrl =
    findFirstUrl(nav.logo?.logo) ||
    findFirstUrl(nav.logo) ||
    null

  const logoUrl = rawLogoUrl
    ? (rawLogoUrl.startsWith('http') ? rawLogoUrl : window.API_URL + rawLogoUrl)
    : null

  const items =
    (Array.isArray(nav.logo?.menultems) && nav.logo.menultems) ||
    (Array.isArray(nav.logo?.menuitems) && nav.logo.menuitems) ||
    (Array.isArray(nav.logo?.menuItems) && nav.logo.menuItems) ||
    (Array.isArray(nav.menultems) && nav.menultems) ||
    (Array.isArray(nav.menuitems) && nav.menuitems) ||
    (Array.isArray(nav.menuItems) && nav.menuItems) ||
    []

  return (
    <div className="glass nav">
      <div className="logo">
        {logoUrl ? <img src={logoUrl} alt="Logo" /> : (loading ? '...' : null)}
      </div>
      <div className="menu">
        <div className="menu-items">
          {loading && items.length === 0 ? '...' : items.map((it) => {
            const href = it?.href || '#'
            const label = it?.label || ''
            const external = !!it?.isExternal
            const key = it?.id ?? href
            return external
              ? <a key={key} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
              : <a key={key} href={href}>{label}</a>
          })}
          {!loading && items.length === 0 && (
            <span style={{ opacity: .6 }}>No menu items found</span>
          )}
        </div>
        <div className="hamburger" />
      </div>
    </div>
  )
}
window.Navigation = Navigation
