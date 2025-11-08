const Footer = () => {
  const emailLinkRef = React.useRef(null)
  const emailTextRef = React.useRef(null)
  const menuBoxRef = React.useRef(null)
  const menuTitleRef = React.useRef(null)
  const menuLinksRef = React.useRef(null)

  React.useEffect(() => {
    const fetchJSON =
      window.fetchJSON ||
      (path =>
        fetch((window.API_URL || '') + path).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.json()
        }))

    let inited = false
    const safeInit = () => { if (!inited) { inited = true; initFooterAnims() } }

    function initFooterAnims() {
      const { gsap, ScrollTrigger, SplitText } = window
      if (!gsap || !ScrollTrigger || !SplitText) return
      gsap.registerPlugin(ScrollTrigger, SplitText)

      const footer = document.querySelector('.footer')
      const footerEmail = document.querySelector('.footer-email')
      if (!footer || !footerEmail) return

      gsap.timeline({
        scrollTrigger: { trigger: footer, start: 'top 25%', toggleActions: 'play none none reverse' }
      })
      .to(gsap.utils.toArray('.nav'), { opacity: 0, y: '-100%', duration: 1.5, ease: 'expo.in' })
      .to(gsap.utils.toArray('.sticky-button'), { opacity: 0, x: '100%', duration: 0.7, ease: 'expo.in' }, 0)

      const splitEmail = new SplitText(footerEmail, { type: 'chars' })
      gsap.set(splitEmail.chars, { opacity: 0 })
      gsap.timeline({
        scrollTrigger: { trigger: footer, start: 'top 75%', toggleActions: 'play none none reverse' }
      }).fromTo(splitEmail.chars, { opacity: 0 }, { opacity: 1, stagger: 0.2, duration: 2, ease: 'expo.in' })
    }

    // EMAIL
    fetchJSON('/api/global?populate[email][populate][email][populate]=*')
      .then(j => {
        const G = j?.data?.attributes || j?.data || {}
        const list = Array.isArray(G.email) ? G.email : []
        const first = list[0] || {}
        const node = first.email || first

        const rawHref = node?.href
        const label   = node?.label
        const ext     = node?.isExternal

        if (!rawHref || !label) return

        let href = rawHref
        if (!/^https?:|^mailto:/i.test(rawHref) && /@/.test(rawHref)) href = 'mailto:' + rawHref

        const isExternal = ext === true || String(ext).toLowerCase() === 'true'

        const a = emailLinkRef.current
        const h3 = emailTextRef.current
        if (a) {
          a.setAttribute('href', href)
          if (isExternal) {
            a.setAttribute('target', '_blank')
            a.setAttribute('rel', 'noopener noreferrer')
          } else {
            a.removeAttribute('target'); a.removeAttribute('rel')
          }
        }
        if (h3) h3.textContent = label
      })
      .catch(console.error)
      .finally(safeInit)

    fetchJSON('/api/global?populate[otherMenus][populate][urls][populate]=*')
      .then(j => {
        const G = j?.data?.attributes || j?.data || {}
        const menus = Array.isArray(G.otherMenus) ? G.otherMenus : []

        let menuData = menus.find(m => Number(m?.id) === 5) ||
                       menus.find(m => String(m?.title || '').toLowerCase() === 'menu') ||
                       null

        console.log('Footer menu (id 5) resolved to:', menuData)

        if (!menuData) return

        const title = menuData.title || 'Menu'
        const urls  = Array.isArray(menuData.urls) ? menuData.urls : []

        if (menuTitleRef.current) menuTitleRef.current.textContent = title

        if (menuLinksRef.current) {
          menuLinksRef.current.innerHTML = ''
          urls.forEach(u => {
            const label = u?.label || u?.href || ''
            if (!label) return
            let href = u?.href || '#'
            const isExternal = u?.isExternal === true || String(u?.isExternal).toLowerCase() === 'true'

            const a = document.createElement('a')
            a.textContent = label
            a.setAttribute('href', href)

            if (isExternal) {
              a.setAttribute('target', '_blank')
              a.setAttribute('rel', 'noopener noreferrer')
            }

            menuLinksRef.current.appendChild(a)
          })
        }
      })
      .catch(console.error)
      .finally(safeInit)
  }, [])

  return (
    <div className="footer glass full-height">
      <div className="footer-colums">
        {/* Dynamic Menu from otherMenus (id 5) */}
        <div className="footer-items" ref={menuBoxRef}>
          <h4 ref={menuTitleRef}>Menu</h4>
          <div ref={menuLinksRef}>
            {/* gets replaced with fetched links */}
            <a>About</a>
            <a>Projects</a>
            <a>Blog</a>
            <a>Résumé</a>
            <a>Contact</a>
          </div>
        </div>

        <div className="footer-items">
          <h4>Socials</h4>
          <a>Whatsapp</a>
          <a>Instagram</a>
          <a>LinkedIn</a>
          <a>Chess.com</a>
        </div>
      </div>

      <a className="footer-email underline" href="#" ref={emailLinkRef}>
        <h3 ref={emailTextRef}></h3>
      </a>

      <div className="footer-colums">
        <div className="footer-items">
          <h4>Boring Stuff</h4>
          <a>FAQ</a>
          <a>Datenschutz</a>
          <a>Terms + Conditions</a>
        </div>
        <div className="phonenumbers">
          <div className="phone-num">
            <div className="button-1 button glass"><p>🇬🇧 +44 7519 418 970</p></div>
            <div className="button-1 button glass"><p>🇫🇷 +33 7531 418 67</p></div>
            <div className="button-1 button glass"><p>🇳🇱 +31 6847 446 91</p></div>
          </div>
          <p className="phoneStatement p2">*The British number is always on, the French and Dutch numbers are sometimes off.</p>
        </div>
      </div>
    </div>
  )
}
window.Footer = Footer