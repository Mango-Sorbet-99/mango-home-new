const FAQ = () => {
  const wrapperRef = React.useRef(null)

  React.useEffect(() => {
    const fetchJSON =
      window.fetchJSON ||
      (path =>
        fetch((window.API_URL || '') + path).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.json()
        }))
    
    async function loadFAQ() {
      const j = await fetchJSON('/api/section?populate[faq]=*')

      const items =
        Array.isArray(j?.data?.faq) ? j.data.faq :
        Array.isArray(j?.data?.attributes?.faq) ? j.data.attributes.faq :
        []

      if (!wrapperRef.current) return
      wrapperRef.current.innerHTML = ''

      items.forEach((f, i) => {
        const title = f?.title || ''
        const body = f?.body || ''
        if (!title) return

        const item = document.createElement('div')
        item.className = 'accordion-item'

        const btn = document.createElement('button')
        btn.id = `faq-btn-${i}`
        btn.setAttribute('aria-expanded', 'false')
        btn.innerHTML = `
          <span class="accordion-title">${title}</span>
          <span class="icon" aria-hidden="true"></span>
        `

        const content = document.createElement('div')
        content.className = 'accordion-content'
        content.innerHTML = `<p>${body}</p>`

        item.appendChild(btn)
        item.appendChild(content)
        wrapperRef.current.appendChild(item)
      })

      // After inserting DOM, activate accordion logic
      initAccordion()
    }

    function initAccordion() {
      const items = wrapperRef.current.querySelectorAll(".accordion button")

      function toggleAccordion() {
        const isOpen = this.getAttribute('aria-expanded') === 'true'
        items.forEach(btn => btn.setAttribute('aria-expanded', 'false'))
        if (!isOpen) this.setAttribute('aria-expanded', 'true')
      }

      items.forEach(btn => btn.addEventListener('click', toggleAccordion))
    }

    loadFAQ()
  }, [])

  return (
    <div className="FAQS">
      <h3>Frequently Asked Questions</h3>
      <div className="accordion" ref={wrapperRef}></div>
    </div>
  )
}

window.FAQ = FAQ
