const Navigation = () => {
  const { loading, global } = window.useGlobalData()
  const g = Array.isArray(global) ? (global[0] || {}) : (global || {})
  const nav = g.navigation || {} // <— the data is here in your API

  const getUrl = (m) => {
    const u = m?.data?.attributes?.url || m?.attributes?.url || m?.url || null
    return u ? (u.startsWith('http') ? u : window.API_URL + u) : null
  }

  // Global → navigation → logo(component) → logo(media)
  const logoUrl = getUrl(nav?.logo?.logo)

  // Global → navigation → menuItems (camelCase)
  const items = Array.isArray(nav?.menuItems) ? nav.menuItems : []

  // TEMP: debug (remove after it renders)
  React.useEffect(() => {
    if (!loading) {
      console.log('g:', g)
      console.log('nav:', nav)
      console.log('logoUrl:', logoUrl)
      console.log('items:', items)
    }
  }, [loading, g])

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
            <span style={{opacity:.6}}>No menu items found</span>
          )}
        </div>
        <div className="hamburger" />
      </div>
    </div>
  )
}
window.Navigation = Navigation
