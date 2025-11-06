export const API = (path, opts = {}) =>
  fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  }).then(async (r) => {
    const body = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(body?.error?.message || r.statusText)
    return body
  })
