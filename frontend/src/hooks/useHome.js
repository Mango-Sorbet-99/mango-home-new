import { useEffect, useState } from 'react'
import { API } from '../lib/api'

export function useHome(token) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    API('/api/home', { headers })
      .then((json) => alive && setData(json.data))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [token])

  return { data, loading, error }
}
